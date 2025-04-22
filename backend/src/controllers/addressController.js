import AddressService from '../services/addressService.js';

export const getAddresses = async (req, res, next) => {
  try {
    let addresses;
    if (req.user.role === "A") {
      addresses = await AddressService.getAllAddresses();
    } else {
      addresses = await AddressService.getUserAddresses(req.user.id);
    }
    res.status(200).json({ message: "Get data successfully", data: addresses });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  if (req.user.role === "A") {
    try {
      console.log(" Data received from Frontend:", req.body);
  
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ message: "Address data is required" });
      }
  
      const { userId, addressLine, province, district, subdistrict, postalCode, apartment } = address;
  
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
  
      if (!addressLine) {
        return res.status(400).json({ message: "AddressLine is required" });
      }
  
      const newAddress = await AddressService.createAddress(Number(userId), {
        addressLine,
        province,
        district,
        subdistrict,
        postalCode,
        apartment,
      });
  
      res.status(201).json({ message: "Address added successfully", data: newAddress });
    } catch (error) {
      console.error(" Error creating address:", error);
      next(error);
    }  
  }
  else{
    try {
  
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ message: "Address data is required" });
      }
  
      const { addressLine, province, district, subdistrict, postalCode, apartment } = address;
      if (!addressLine) {
        return res.status(400).json({ message: "AddressLine is required" });
      }
  
      const newAddress = await AddressService.createAddress(req.user.id, {
        addressLine,
        province,
        district,
        subdistrict,
        postalCode,
        apartment,
      });
  
      res.status(201).json({ message: "Address added successfully", data: newAddress });
    } catch (error) {
      console.error(" Error creating address:", error);
      next(error);
    }
  }
};

export const modifyAddress = async (req, res, next) => {
  try {
    console.log(" PUT /api/addresses/:id - req.body:", req.body);
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address data is required" });
    }

    const { addressLine, province, district, subdistrict, postalCode, apartment } = address;
    if (!addressLine) {
      return res.status(400).json({ message: "AddressLine is required" });
    }

    const updatedAddress = await AddressService.updateAddress(Number(req.params.id), {
      addressLine,
      province,
      district,
      subdistrict,
      postalCode,
      apartment,
    });

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address updated successfully", data: updatedAddress });
  } catch (error) {
    console.error(" Error updating address:", error);
    next(error);
  }
};


export const removeAddress = async (req, res, next) => {
  try {
    const deleted = await AddressService.deleteAddress(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
};
