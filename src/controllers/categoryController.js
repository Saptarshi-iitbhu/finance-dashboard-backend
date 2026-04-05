import categoryModel from "../models/categoryModel.js";

export const createCategory = async(req, res)=>{
    try{
        const { name } = req.body;
        const match = await categoryModel.findOne({ name });

        if(match){
            return res.status(400).json("Category already exists!");
        }

        const newCategory = new categoryModel({ name });
        const category = await newCategory.save();

        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};