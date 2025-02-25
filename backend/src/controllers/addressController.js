import {
    getAllAddresses,
    getUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  } from "../services/addressService.js";
  
  export const getAddresses = async (req, res, next) => {
    try {
      let addresses;
      if (req.user.role === "A") {
        addresses = await getAllAddresses();
      } else {
        addresses = await getUserAddresses(req.user.id);
      }
      res.status(200).json({ message: "Get data successfully", data: addresses });
    } catch (error) {
      next(error);
    }
  };
  
  export const addAddress = async (req, res, next) => {
    try {
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ message: "Address data is required" });
      }
  
      const newAddress = await createAddress(req.user.id, address);
      res.status(201).json({ message: "Address added successfully", data: newAddress });
    } catch (error) {
      next(error);
    }
  };
  
  export const modifyAddress = async (req, res, next) => {
    try {
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ message: "Address data is required" });
      }
  
      const updatedAddress = await updateAddress(Number(req.params.id), address);
      if (!updatedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
  
      res.status(200).json({ message: "Address updated successfully", data: updatedAddress });
    } catch (error) {
      next(error);
    }
  };
  
  export const removeAddress = async (req, res, next) => {
    try {
      await deleteAddress(Number(req.params.id));
      res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  