import e, { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";
import Role from "../models/Roles";
import Comment from "../models/Comment";
import * as yup from "yup";
import APIError from "../helpers/APIError";
import jwt from 'jsonwebtoken';
import Product from "../models/Product";
import ActionsCounter from "../models/ActionsCounter";
import PriceHistory from "../models/PriceHistory";
import ProductAttributes from '../models/ProductAttributes';
import { ref } from "objection";
import Category from "../models/Category";
import Favorite from "../models/Favorite";

type JwtPayload = {
    userId: number
}

const createUserSchema = yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    password_repeat: yup.string().required(),
    favorites: yup.array()
});

const authUserSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

const changePasswordSchema = yup.object().shape({
    id: yup.string().required(),
    old_password: yup.string().required(),
});

const hashPassword = (password: string) => {
    const salt = process.env.SALT || "";
    return crypto.pbkdf2Sync(password, salt, 100, 64, `sha256`).toString(`hex`);
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {

    const { first_name, last_name, email, password, password_repeat, favorites } = req.body;

    await createUserSchema.validate(req.body);

    if (password !== password_repeat) {
        throw new APIError(422, "Password and repeat password do not match");
    }

    const getData = await User.query().findOne("email", email); // name

    if (getData) {
        throw new APIError(422, "User with this email exists");
    }

    const userRole = await Role.query().findOne("role_name", "User");
    // await User.transaction(async trx => {
    //     await insertPersonAndPet(person, pet, trx);
    //   });
    const insertedGraph = await User.transaction(async (trx) => {
        // console.log(req.body);
        const insertedGraph = await User.query(trx).insertGraph({
            first_name, last_name, email,
            favorites,
            password: hashPassword(password)
        })
        //     .allowGraph('[favorites]')
        //     .insertGraph(req.body)
        return insertedGraph;
    })

    return res.status(201).json({ data: insertedGraph });

}


const getUser = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;

    await authUserSchema.validate(req.body);

    const getData = await User.query()
        .select("id")
        .where("email", email)
        .where("password", hashPassword(password)); // name

    if (getData) {
        throw new APIError(422, "Email or password is incorrect");
    }



    console.log(getData);

    const token = jwt.sign(
        {
            email: email,
            userId: getData,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );


    return res.status(201).json({ token: token });

}

const addComment = async (req: Request, res: Response, next: NextFunction) => {


    const { id, text, token, type } = req.body;
    // return res.status(201).json({ data: 1 });
    // await authUserSchema.validate(req.body);

    // const getData = await User.query()
    //     .select("id")
    //     .where("email", email)
    //     .where("password", hashPassword(password)); // name

    // if (getData) {
    //     throw new APIError(422, "Email or password is incorrect");
    // }



    // console.log(getData);
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // const data = await User.query()
    //     .select("*")
    //     .where("id", userId); // name
    // // const token = jwt.sign(
    //     {
    //         email: email,
    //         userId: getData,
    //     },
    //     process.env.JWT_SECRET,
    //     { expiresIn: "1d" }
    // );


    if (type === "addComment") {
        // const data = Comment.query().insert({
        //     product_id: id,
        //     user_id: userId,
        //     comment: text,
        //     like: false
        const returnData = await Comment.transaction(async (trx) => {
            // console.log(req.body);
            await Comment.query(trx).insertGraph({
                product_id: id,
                user_id: userId,
                comment: text,
                like: false
            })

            const returnData = Comment.query(trx).select("*").where("product_id", id);
            // console.log(returnData)

            return returnData;
        })

        return res.status(201).json({ data: returnData });
    }
    return res.status(404).json({
        data: "NOT FOUND"
    });
}


const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params)
    const { id } = req.params;

    if (!id) {
        throw new APIError(500, "missing ID");
    }
    const getData = await Product.query().findById(id)

    // console.log(ref("products.attributes:HZ"))
    if (!getData) {
        throw new APIError(500, "Product is missing");
    }

    const commentsData = await Comment.query().select("*").where('product_id', id);
    const dynamicsData = await PriceHistory.query().select("*").where('product_id', id);
    const reviewCountData = await ActionsCounter.query().select("*").where('product_id', id).limit(1);
    const priceHistoryData = await PriceHistory.query().select("*").where('product_id', id);
    const attributes = await ProductAttributes.query()
        .select('*')
        // .joinRelated('[attribute]')
        .withGraphFetched('[attribute]')
        .where('productID', id);

    await ActionsCounter.query().increment("views_count", 1).where("product_id", id);
    // console.log(priceHistoryData)
    return res.status(201).json({
        data: {
            product: getData,
            productAttributes: attributes,
            comments: commentsData,
            price: dynamicsData,
            reviewData: reviewCountData[0] || {
                likes_count: 0,
                comments_count: 0,
                favorites_count: 0,
                views_count: 0,
                dislike_count: 0
            },
            priceDynamics: priceHistoryData
        }
    });

}


const productsList = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params)
    const { categoryName } = req.params;

    if (!categoryName) {
        throw new APIError(500, "Choose the category");
    }

    const getData = await Category.query()
        .select('categories.name', 'products.*', 'users_favorite_products.userID', "actions_counter.*")
        .innerJoin('products', 'products.category_id', 'categories.id')
        .innerJoin('actions_counter', 'actions_counter.product_id', 'products.id')
        .leftJoin('users_favorite_products', function () {
            this
                .on('users_favorite_products.productID', '=', 'products.id')
                .andOnVal('users_favorite_products.userID', '=', 1)
        }).as('newtable')
        .where('categories.name', categoryName);



    return res.status(201).json({
        data: getData
    })
    // const commentsData = await Comment.query().select("*").where('product_id', id);
    // const dynamicsData = await PriceHistory.query().select("*").where('product_id', id);
    // const reviewCountData = await ActionsCounter.query().select("*").where('product_id', id).limit(1);
    // const priceHistoryData = await PriceHistory.query().select("*").where('product_id', id);
    // const attributes = await ProductAttributes.query()
    //     .select('*')
    //     // .joinRelated('[attribute]')
    //     .withGraphFetched('[attribute]')
    //     .where('productID', id);

    // await ActionsCounter.query().increment("views_count", 1).where("product_id", id);
    // // console.log(priceHistoryData)
    // return res.status(201).json({
    //     data: {
    //         product: getData,
    //         productAttributes: attributes,
    //         comments: commentsData,
    //         price: dynamicsData,
    //         reviewData: reviewCountData[0] || {
    //             likes_count: 0,
    //             comments_count: 0,
    //             favorites_count: 0,
    //             views_count: 0,
    //             dislike_count: 0
    //         },
    //         priceDynamics: priceHistoryData
    //     }
    // });

}

// Update favorite status to current user product
const updateFavProduct = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params)
    const { id } = req.params;

    if (!id) {
        throw new APIError(500, "Enter the user ID");
    }

    const affectedRows = await Favorite.query().delete().where('productID', id).andWhere('userID', 1);
    console.log(affectedRows)
    if (affectedRows == 0) {
        const data = await Favorite.query().insert({
            productID: +id,
            userID: 1
        })
        console.log(data);  
        return res.status(201).json(data)
    }
    return res.status(201).json({})
}


export {
    createUser,
    getUser,
    addComment,
    getProduct,
    productsList,
    updateFavProduct
}; // deleteUser, getUser, updateUser 