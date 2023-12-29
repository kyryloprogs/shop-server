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
import Attribute from "../models/Attributes";
import SearchBase from "../models/SearchBase";
import Subcategory from "../models/Subcategory";

type JwtPayload = {
    userId: number,
    exp: number
}

const createUserSchema = yup.object().shape({
    name: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().min(10).max(20),
    confirmPassword: yup.string().required(),
    getUpdates: yup.boolean()
});

const authUserSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
    forever: yup.boolean(),
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

    const { name, lastName, password, confirmPassword, email, getUpdates } = req.body;
    await createUserSchema.validate(req.body);

    if (password !== confirmPassword) {
        throw new APIError(422, "Password and repeat password do not match");
    }

    const getData = await User.query().findOne("email", email); // name

    if (getData) {
        throw new APIError(422, "User with this email exists");
    }

    const userRole = await Role.query().findOne("role_name", "User");

    const insertedGraph = await User.query().insert({
        first_name: name,
        last_name: lastName,
        email,
        get_updates: getUpdates,
        password: hashPassword(password),
        role_id: userRole.id
    })

    const token = jwt.sign(
        {
            email: insertedGraph.email,
            userId: insertedGraph.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );


    return res.status(201).json({ token: token });
}


const validateToken = async (req: Request, res: Response, next: NextFunction) => {

    const { token } = req.body;
    const header = jwt.decode(token) as JwtPayload;
    const now = Math.floor(Date.now() / 1000)

    if (!header) {
        return res.status(201).json(false);
    } else {
        return res.status(201).json(header && header.exp > now);
    }

}



const getUser = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password, rememberUser } = req.body;

    await authUserSchema.validate(req.body);

    const getData = await User.query().findOne({
        email,
        password: hashPassword(password)
    })

    if (!getData) {
        throw new APIError(422, "Email or password is incorrect");
    }

    const token = jwt.sign(
        {
            email: email,
            userId: getData.id,
        },
        process.env.JWT_SECRET,
        !rememberUser && { expiresIn: "1d" }
    );


    return res.status(201).json({ token: token });
}

const getAdminUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const usr = await User.query().findById(userId).select('role_id');
    const result = (!usr.role_id || +usr.role_id !== 2 ? false : true);

    if (!result) throw new APIError(403, "Not admin.");

    const getData = await User.query().select('first_name', 'last_name', 'email', 'id', 'phone', 'role_id')

    return res.status(201).json(getData);
}

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const { role_id } = req.body;
    const { id } = req.params;

    const usr = await User.query().findById(userId).select('role_id');
    const result = (!usr.role_id || +usr.role_id !== 2 ? false : true);

    if (!result) throw new APIError(403, "Not admin.");

    await User.query().findById(id).patch({
        role_id: role_id
    })

    return res.status(201).json("ok");
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const { id } = req.params;

    const usr = await User.query().findById(userId).select('role_id');
    const result = (!usr.role_id || +usr.role_id !== 2 ? false : true);

    if (!result) throw new APIError(403, "Not admin.");

    await User.query().findById(+id).delete();

    return res.status(201).json("ok");
}
const getUserDataByID = async (req: Request, res: Response, next: NextFunction) => {

    console.log(req.params)
    const { id } = req.params;

    if (!id) {
        throw new APIError(500, "missing ID");
    }
    // const token = req.headers.authorization;

    // const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const getData = await User.query().findById(id).select('first_name', 'avatar')

    return res.status(201).json({
        name: getData.first_name || "",
        avatar: getData.avatar || "",
    });

}


const getUserData = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;

    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const getData = await User.query().findById(userId).select('first_name', 'last_name', 'email', 'avatar', 'phone')

    return res.status(201).json({
        name: getData.first_name || "",
        lastName: getData.last_name || "",
        email: getData.email || "",
        avatar: getData.avatar || "",
        phone: getData.phone || ""
    });

}

const updateUserData = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;

    const { name, lastName, phone, email, password, rememberUser } = req.body;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    await User.query().findById(userId).patch({
        first_name: name,
        last_name: lastName,
        email,
        phone,
        get_updates: rememberUser
    })

    password && await User.query().findById(userId).patch({
        password: hashPassword(password)
    })

    const newToken = jwt.sign(
        {
            email: email,
            userId: userId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return res.status(201).json({ token: newToken });
}

const addComment = async (req: Request, res: Response, next: NextFunction) => {


    const { id, text, token, type } = req.body;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;


    if (type === "addComment") {

        const returnData = await Comment.transaction(async (trx) => {

            await Comment.query(trx).insertGraph({
                product_id: id,
                user_id: userId,
                comment: text,
                like: false
            })

            const returnData = Comment.query(trx).select("*").where("product_id", id);

            return returnData;
        })

        return res.status(201).json({ data: returnData });
    }
    return res.status(404).json({
        data: "NOT FOUND"
    });
}


const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        throw new APIError(500, "missing ID");
    }

    try {
        const productData = await Product.query().findById(id).withGraphFetched('images'); // Изменение тут

        if (!productData) {
            throw new APIError(500, "Product is missing");
        }

        const commentsData = await Comment.query().select("*").where('product_id', id);
        const dynamicsData = await PriceHistory.query().select("*").where('product_id', id);
        const reviewCountData = await ActionsCounter.query().select("*").where('product_id', id).limit(1);
        const priceHistoryData = await PriceHistory.query().select("*").where('product_id', id);
        const attributes = await ProductAttributes.query()
            .select('*')
            .withGraphFetched('[attribute]')
            .where('productID', id);

        await ActionsCounter.query().increment("views_count", 1).where("product_id", id);

        return res.status(201).json({
            data: {
                comments: commentsData,
                product: productData, // Изменение тут
                productAttributes: attributes,
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
    } catch (error) {
        console.error(error);
        next(error);
    }
};



const productsList = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params)
    const { categoryName, id } = req.params;
    const token = req.headers.authorization;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    console.log(categoryName, id)
    if (!categoryName) {
        throw new APIError(500, "Choose the category");
    }

    const getData = Category.query()
        .select('categories.name', 'products.*', 'users_favorite_products.userID', "actions_counter.*")
        .innerJoin('products', 'products.category_id', 'categories.id')
        .innerJoin('actions_counter', 'actions_counter.product_id', 'products.id')
        .leftJoin('users_favorite_products', function () {
            this
                .on('users_favorite_products.productID', '=', 'products.id')
                .andOnVal('users_favorite_products.userID', '=', userId)
        }).as('newtable')

    if (categoryName === "favorites") {
        getData.whereNotNull('users_favorite_products.productID');
    } else {
        getData.where('categories.name', categoryName)
    }


    if (+id) {
        getData.andWhere('products.subcategory_id', id);
    }

    const resultFilter = await getData;

    console.log(resultFilter)

    return res.status(201).json({
        data: resultFilter
    })

}

const getProductSimple = async (req: Request, res: Response, next: NextFunction) => {

    const { query } = req.query;
    console.log("query", query)
    if (typeof query === 'string') {
        const getData = await Category.query()
            .select('categories.name', 'products.*', 'users_favorite_products.userID', "actions_counter.*")
            .innerJoin('products', 'products.category_id', 'categories.id')
            .innerJoin('actions_counter', 'actions_counter.product_id', 'products.id')
            .leftJoin('users_favorite_products', function () {
                this
                    .on('users_favorite_products.productID', '=', 'products.id')
                    .andOnVal('users_favorite_products.userID', '=', 1)
            }).as('newtable')
            .where('products.name', "like", `%${query}%`);

        return res.status(201).json({
            data: getData
        })
    }
    else {
        return res.status(400).send('Invalid query');
    }
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

const getProductCategories = async (req: Request, res: Response, next: NextFunction) => {

    const productName = req.query.text;
    console.log(productName);
    const attributes = await Attribute.query()
        .join('product_attributes', 'attributes.id', '=', 'product_attributes.attributeID')
        .join('products', 'product_attributes.productID', '=', 'products.id')
        .where('products.name', 'like', `%${productName}%`)
        .distinct('attributes.id', 'attributes.name', 'attributes.value');

    // console.log(attributes)
    return res.status(201).json(attributes);
}

const addSearchBase = async (req: Request, res: Response, next: NextFunction) => {

    const text = req.query.text || "";

    console.log('TEXT:', req.query);
    if (typeof text === 'string' && text) {
        console.log('productName is a string:', text);

        const existingRecord = await SearchBase.query().where({ text }).first();

        if (existingRecord) {
            // console.log(existingRecord)
            // Если запись существует, выполним обновление
            const test = await SearchBase.query().where({ text })
                .patch({ count: existingRecord.count + 1 });
            console.log(test)
        } else {
            // Если запись не существует, выполним вставку новой записи
            await SearchBase.query().insert({
                text,
                count: 1
            });
        }

        return res.status(201).send('Product name added successfully.');
    } else {
        // console.log('productName is not a string:', text);
        return res.status(400).send('Invalid product name.');
    }
}

const getSearchBase = async (req: Request, res: Response, next: NextFunction) => {

    const text = req.query.text || "";
    console.log(text);
    let result: any[] = [];

    if (typeof text === 'string') {
        const words = text.split(" ");
        words.unshift(text);

        for (const e of words) {
            const queryResult = await SearchBase.query()
                .select("text")
                .where('text', 'like', `%${e}%`)
                .limit(3)
                .orderBy('count', 'desc');

            result = [...result, ...queryResult];
            console.log(result);
        }

        // Дополнительный запрос для получения продуктов с похожим названием
        const products = await Product.query()
            .select("id", "name", "main_img")
            .where('name', 'like', `%${text}%`)
            .limit(3);

        return res.status(200).json({ result, products });
    } else {
        console.log('productName is not a string:', text);
        return res.status(400).send('Invalid product name.');
    }
}

const getComments = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const { id } = req.params;

    const commentsData = await Comment.query().select("*").where('product_id', id);

    const usr = await User.query().findById(userId).select('role_id');
    const result = (!usr.role_id || +usr.role_id !== 2 ? false : true);

    const commentsExtended = commentsData.map(comment => ({
        ...comment,
        is_me: comment.user_id === userId,
    }));

    return res.status(201).json({
        comments: commentsExtended,
        isAdmin: result,
    });

}

const postComment = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const { comment, product_id } = req.body;
    console.log(product_id)
    try {
        await Comment.query().insert({
            comment: comment,
            product_id: +product_id,
            user_id: userId
        })
    } catch (e) {
        console.log(e)
    }

    return res.status(201).json({ ok: true })
}

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const usr = await User.query().findById(userId).select('role_id');
    const result = (!usr.role_id || +usr.role_id !== 2 ? false : true);

    try {
        if (!result) return res.status(403).json({ ok: false })

        const { id } = req.params;
        console.log(id)
        try {
            await Comment.query().findById(+id).delete();
        } catch (e) {
            console.log(e)
        }

    } catch (e) {
        console.log(e)
    }

    return res.status(201).json({ ok: true })
}

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    console.log("!")
    const token = req.headers.authorization;
    console.log(token)
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const usr = await User.query().findById(userId).select('role_id');

    const result = (!usr.role_id || +usr.role_id !== 2 ? false : true);

    if (!result) throw new APIError(403, "Not admin")

    console.log("!")
    const products = await Product.query().select("*");

    return res.status(201).json(products);
}

const getProductAttributes = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    // Fetch attributes and values for the given product
    console.log(productId);

    const clearAttributes = await Attribute.query().select('*')
    // .join('product_attributes', 'attributes.id', 'product_attributes.attributeId')
    console.log(clearAttributes)
    const attributes = await Attribute.query()
        .select('attributes.id', 'attributes.name', 'attributes.value')
        .join('product_attributes', 'attributes.id', 'product_attributes.attributeId')
        .where('product_attributes.productId', productId);

    const productAttributes = attributes.map((attr) => ({
        attributeId: attr.id,
        attributeName: attr.name,
        value: attr.value, // Include the value in the response
    }));

    return res.status(201).json({ attributes: clearAttributes, productAttributes: productAttributes });
    // return res.status(201).json({ attributes: formattedAttributes, productAttributes });
}

const updateProductAttributes = async (req: Request, res: Response, next: NextFunction) => {
    console.log("!")
    const productId = req.params.id;
    const selectedAttributes = req.body; // Предполагается, что в теле запроса отправляются ID выбранных атрибутов
    try {
        // Удалите текущие атрибуты товара
        await ProductAttributes.query().delete().where('productId', productId);


        await ProductAttributes.query().insertGraph(
            selectedAttributes.map((attributeId) => ({
                productId: productId,
                attributeId: attributeId
            }))
        );
    } catch (e) {
        console.log(e)
    }

    console
    return res.status(201).json({ success: true, message: 'Attributes updated successfully' });
    // .json({ attributes: attributes, productAttributes: productAttributes });
    // return res.status(201).json({ attributes: formattedAttributes, productAttributes });
}

const postAttributes = async (req: Request, res: Response, next: NextFunction) => {
    const { name, value } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const newAttribute = await Attribute.query().insert({ name, value });

    return res.status(201).json(newAttribute);
}

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    const updatedProductData = req.body;

    delete updatedProductData.predictedprice;

    const updatedProduct = await Product.query()
        .findById(productId)
        .patch({ ...updatedProductData, sale: +updatedProductData.sale || 0 }); // This returns the updated row

    if (!updatedProduct) {
        throw new APIError(403, 'Product not found');
    }

    const newProduct = (await Product.query().findById(productId).select("*")) as Product
    try {
        await PriceHistory.query().insert({
            product_id: newProduct.id,
            price: newProduct.price - newProduct.price * newProduct.sale / 100,
            clear_price: newProduct.price,
            sale: newProduct.sale
        });
    } catch (e) {
        console.log(e)
    }


    return res.status(200).json({ updatedProduct: newProduct });
}

const postProducts = async (req: Request, res: Response, next: NextFunction) => {

    const updatedProductData = req.body; // Предполагается, что вы отправляете все данные о продукте на сервер
    delete updatedProductData.predictedprice;
    delete updatedProductData.id;
    console.log(updatedProductData)
    // try {
    const updatedProduct = (await Product.query().insert({ ...updatedProductData, sale: +updatedProductData.sale || 0 })) as Product;

    if (!updatedProduct) throw new APIError(403, 'Error');

    await PriceHistory.query().insert({
        product_id: updatedProduct.id,
        price: updatedProduct.price,
        clear_price: updatedProduct.price - updatedProduct.price * updatedProduct.sale / 100,
        sale: updatedProduct.sale
    });

    return res.status(200).json({ updatedProduct });
}

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    await Product.query().findById(productId).delete();
    return res.status(201).json({ ok: true })
}

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    const updatedProduct = await Category.query().select("*");
    return res.status(201).json(updatedProduct)
}

const getSubcategories = async (req: Request, res: Response, next: NextFunction) => {
    const updatedProduct = await Subcategory.query().select("*");
    return res.status(201).json(updatedProduct)
}

const getCategoriesByName = async (req: Request, res: Response, next: NextFunction) => {
    const categoryName = req.params.id;

    const updatedProduct = await Subcategory.query().select("id", 'full_name').where("category_id", categoryName);
    return res.status(201).json({
        result: updatedProduct
    })
}

export {
    createUser,
    getUser,
    getAdminUser,
    getUserData,
    deleteUser,
    addComment,
    getProduct,
    productsList,
    updateFavProduct,
    getProductCategories,
    addSearchBase,
    getSearchBase,
    getProductSimple,
    validateToken,
    updateUserData,
    getUserDataByID,
    getComments,
    postComment,
    deleteComment,
    updateRole,
    getProducts,
    // * Product attributes
    postProducts,
    getProductAttributes,
    updateProductAttributes,
    postAttributes,
    updateProduct,
    deleteProduct,
    getCategories,
    getSubcategories,
    getCategoriesByName
}; 