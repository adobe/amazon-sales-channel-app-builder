# Amazon Sales Channel management

## Creating products

You can add products to ASC by just invoking directly a runtime action. In the process, you can specify:

- websiteId: A magento website
- productStatus: Any of the following; incomplete, active, inactive, newThirdParty, readyToList, ineligible, ended, overrides
- size: Number of random skus being created

```bash
aio rt action invoke amazon-app/api-add-products --result --param websiteId 1 --param productStatus active --param size 12
```

Note: This action does not create products in Commerce or Amazon marketplace.

## Migrate products

You can migrate products already created in ASC from the old DB schema using websiteId to the new one using sellerId and countryId

- websiteId: A magento website
- productStatus: Any of the following; incomplete, active, inactive, newThirdParty, readyToList, ineligible, ended, overrides
- sellerId: SP Seller identifier
- countryId: Numeric identifier of the country where 1 is US and 2 is CA

```bash
aio rt action invoke amazon-app/api-migrate-account --result --param websiteId 1 --param sellerId XXXX --param countryId 1 --param productStatus INCOMPLETE
```
