import { FormChange } from "@saleor/hooks/useForm";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
import { ProductUpdateFormData } from "@saleor/products/components/ProductUpdatePage/form";
import { toggle } from "@saleor/utils/lists";

import { ProductAttributeInputData } from "../components/ProductAttributes";
import { getAttributeInputFromProductType, ProductType } from "./data";

export function createAttributeChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  triggerChange: () => void
): FormsetChange<string> {
  return (attributeId: string, value: string) => {
    triggerChange();
    changeAttributeData(attributeId, value === "" ? [] : [value]);
  };
}

export function createChannelsChangeHandler(
  data: ProductUpdateFormData,
  updateChannels: (data: ProductUpdateFormData) => void,
  triggerChange: () => void
) {
  return (index: number) => (channelData: {
    isPublished: boolean;
    publicationDate: string | null;
  }) => {
    const channels = data.channelListing;
    const newChannels = [...channels];
    newChannels[index] = {
      ...channels[index],
      isPublished: channelData.isPublished,
      publicationDate: channelData.publicationDate
    };
    updateChannels({ ...data, channelListing: newChannels });
    triggerChange();
  };
}

export function createAttributeMultiChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<ProductAttributeInputData, string[]>,
  triggerChange: () => void
): FormsetChange<string> {
  return (attributeId: string, value: string) => {
    const attribute = attributes.find(
      attribute => attribute.id === attributeId
    );

    const newAttributeValues = toggle(
      value,
      attribute.value,
      (a, b) => a === b
    );

    triggerChange();
    changeAttributeData(attributeId, newAttributeValues);
  };
}

export function createProductTypeSelectHandler(
  setAttributes: (data: FormsetData<ProductAttributeInputData>) => void,
  setProductType: (productType: ProductType) => void,
  productTypeChoiceList: ProductType[],
  triggerChange: () => void
): FormChange {
  return (event: React.ChangeEvent<any>) => {
    const id = event.target.value;
    const selectedProductType = productTypeChoiceList.find(
      productType => productType.id === id
    );
    triggerChange();
    setProductType(selectedProductType);
    setAttributes(getAttributeInputFromProductType(selectedProductType));
  };
}

interface ProductAvailabilityArgs {
  availableForPurchase: string | null;
  isAvailableForPurchase: boolean;
  productId: string;
}

export const getProductAvailabilityVariables = ({
  isAvailableForPurchase,
  availableForPurchase,
  productId
}: ProductAvailabilityArgs) => ({
  isAvailable: isAvailableForPurchase,
  productId,
  startDate: availableForPurchase || null
});
