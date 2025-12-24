## product variant service

import prisma from "../prisma";
import { generateSKU } from "../lib/sku.util";
import { extractProductCode } from "../lib/productCode.util";
import { generateSlug } from "../lib/slug.util";

class ProductVariantService {

    async getVariantsByProduct(productId: string) {
        // cek product nya dulu ada/tidak
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
                isDeleted: false
            }
        })
        if (!product) {
            throw new Error("Product not found")
        }

        // get all variant
        const variants = await prisma.productVariant.findMany({
            where: {
                productId,
                isActive: true
            },
            orderBy: {
                createdAt: "asc"
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        })
        return variants
    }

    async createVariant(
        productId: string,
        name: string,
        price: number,
        color?: string,
        size?: string,
        weight: number = 0,
    ) {
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })
        if (!product) {
            throw new Error("Product not found")
        }
        // generate slug
        const slug = generateSlug(name)

        // bikin product code dan hitung variant
        const productCode = extractProductCode(product.name)
        const variantCount = await prisma.productVariant.count({
            where: { productId }
        })
        const counter = variantCount + 1

        // generate sku
        const sku = generateSKU(productCode, color, size, counter)

        // create variant
        try {
            const variant = await prisma.productVariant.create({
                data: {
                    productId,
                    name,
                    slug,
                    sku,
                    price,
                    weight,
                    color,
                    size,
                }
            })
            return variant

        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error("SKU or Slug already exists")
            }
            throw error
        }
    }
}

export default new ProductVariantService();

## product variant controller

import productVariantService from "../services/productVariant.service";
import { Request, Response, NextFunction } from "express";

class ProductVariantController {

    async getVariantsByProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params
            const variants = await productVariantService.getVariantsByProduct(productId)
            res.status(200).json({
                success: true,
                data: variants,
                message: "Variants retrieved successfully"
            })
        } catch (error: any) {
            if (error.message === "Product not found") {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            next(error)
        }
    }


    async createVariant(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params
            const { name, price, color, size, weight } = req.body
            const variant = await productVariantService.createVariant(productId, name, price, color, size, weight)

            if (!name || !price) {
                return res.status(400).json({
                    success: false,
                    error: "Name and price are required",
                });
            }

            res.status(201).json(
                {
                    success: true,
                    data: variant,
                    message: "Variant created successfully"
                }
            )
        } catch (error: any) {
            if (error.message === "Product not found") {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }

            if (error.message === "SKU or Slug already exists.") {
                return res.status(409).json({
                    success: false,
                    error: error.message,
                });
            }
            next(error);
        }
    }
}

export default new ProductVariantController()

## product variant router

import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { checkRoles } from "../middlewares/checkRole.middleware";
import productVariantController from "../controllers/productVariant.controller";

const router = Router()

router.get(
    "/all/:productId",
    productVariantController.getVariantsByProduct
)
router.post(
    "/:productId",
    verifyToken,
    checkRoles(["SUPER_ADMIN"]),
    productVariantController.createVariant
);

export default router


## index.ts

import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.route";
import categoryRouter from "./routers/category.route";
import emailVerifRouter from "./routers/emailVerif.route"
import updateProfileRouter from "./routers/updateProfile.route"
import setPasswordRouter from "./routers/setPassword.route"
import cloudinaryRouter from "./routers/cloudinary.route"
import productRouter from "./routers/product.route";
import variantRouter from "./routers/productVariant.route";

const PORT = process.env.PORT;

// define app server
const app: Application = express();

// define app basic middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // allow other domain to access api
app.use(express.json()); // for receive req.body
app.use(cookieParser());

// define app main router
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("<h1>Online Grocery</h1>");
});

app.use("/auth", authRouter, setPasswordRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/products/var", variantRouter);
app.use("/verify", emailVerifRouter);
app.use("/user", updateProfileRouter);
app.use("/categories", categoryRouter);
app.use("/api/cloudinary", cloudinaryRouter);

// error middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  const statusCode = 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

// run app server
app.listen(PORT, () => {
  console.log("API RUNNING", PORT);
});
