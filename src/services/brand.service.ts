import { Brand } from 'lib/interfaces/models';
import brandModel from 'models/brand.model';
import serviceHandler from 'middlewares/handlers/serviceResponseHandler';
import { ServiceHandlerProps } from 'middlewares/handlers/serviceResponseHandler';

const createBrand = async (brand: Brand): Promise<ServiceHandlerProps> => {
  try {
    return serviceHandler(await new brandModel(brand).save(), null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const getBrands = async (parentBrands: boolean = false): Promise<ServiceHandlerProps> => {
  try {
    const query = parentBrands ? { isParent: true } : {};
    console.log('query:', await brandModel.find(query));
    return serviceHandler(await brandModel.find(query), null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const editById = async (id: string, name: string): Promise<ServiceHandlerProps> => {
  try {
    const isExisting = await brandModel.findOne({ name });
    if (isExisting) {
      return serviceHandler(null, 'Brand name is already taken');
    }
    return serviceHandler(await brandModel.findByIdAndUpdate(id, { name }, { new: true }), null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

export = {
  createBrand,
  getBrands,
  editById,
};
