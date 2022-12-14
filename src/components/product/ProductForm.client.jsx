import {useEffect, useCallback, useState} from 'react';
import swapi from 'swym-apikit-test';
import {
  useProductOptions,
  isBrowser,
  useUrl,
  AddToCartButton,
  Money,
  ShopPayButton,
} from '@shopify/hydrogen';

import {Heading, Text, Button, ProductOptions} from '~/components';

export function ProductForm({data}) {
  const {pathname, search} = useUrl();
  const [params, setParams] = useState(new URLSearchParams(search));

  const {options, setSelectedOption, selectedOptions, selectedVariant} =
    useProductOptions();

    console.log("PRODUCT", data, selectedVariant)

  const isOutOfStock = !selectedVariant?.availableForSale || false;

  const [addedToWishlist, setAddedToWishlist] = useState(false)
  
  const isOnSale =
    selectedVariant?.priceV2?.amount <
      selectedVariant?.compareAtPriceV2?.amount || false;

  useEffect(() => {
    if (params || !search) return;
    setParams(new URLSearchParams(search));
  }, [params, search]);

  useEffect(() => {
    options.map(({name, values}) => {
      if (!params) return;
      const currentValue = params.get(name.toLowerCase()) || null;
      if (currentValue) {
        const matchedValue = values.filter(
          (value) => encodeURIComponent(value.toLowerCase()) === currentValue,
        );
        setSelectedOption(name, matchedValue[0]);
      } else {
        params.set(
          encodeURIComponent(name.toLowerCase()),
          encodeURIComponent(selectedOptions[name].toLowerCase()),
        ),
          window.history.replaceState(
            null,
            '',
            `${pathname}?${params.toString()}`,
          );
      }
    });
  }, []);



  const addToWishlist = () => {
    swapi.fetchLists().then((response) => {
      console.log(response, "RES")
      return response.json()})
    .then((res) => {
      console.log(res);
      const defaultList = res.filter(r=>{
          return r.lname == "My Wishlist"
      })
      console.log(defaultList)

      swapi.updateListCtx({
        lid: defaultList[0].lid,
        "a": [
          {
            "empi": data.id.split("gid://shopify/Product/")[1],
            "du": window.location.origin + window.location.pathname,
            "epi": selectedVariant.id.split("gid://shopify/ProductVariant/")[1]
          }
        ]
      }, function(){
        setAddedToWishlist(true)
      })
    });
    
  }

  const handleChange = useCallback(
    (name, value) => {
      setSelectedOption(name, value);
      if (!params) return;
      params.set(
        encodeURIComponent(name.toLowerCase()),
        encodeURIComponent(value.toLowerCase()),
      );
      if (isBrowser()) {
        window.history.replaceState(
          null,
          '',
          `${pathname}?${params.toString()}`,
        );
      }
    },
    [setSelectedOption, params, pathname],
  );

  return (
    <form className="grid gap-10">
      {
        <div className="grid gap-4">
          {options.map(({name, values}) => {
            if (values.length === 1) {
              return null;
            }
            return (
              <div
                key={name}
                className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
              >
                <Heading as="legend" size="lead" className="min-w-[4rem]">
                  {name}
                </Heading>
                <div className="flex flex-wrap items-baseline gap-4">
                  <ProductOptions
                    name={name}
                    handleChange={handleChange}
                    values={values}
                  />
                </div>
              </div>
            );
          })}
        </div>
      }
      <div className="grid items-stretch gap-4">
        <AddToCartButton
          variantId={selectedVariant?.id}
          quantity={1}
          accessibleAddingToCartLabel="Adding item to your cart"
          disabled={isOutOfStock}
          type="button"
        >
          <Button
            width="full"
            variant={isOutOfStock ? 'secondary' : 'primary'}
            as="span"
          >
            {isOutOfStock ? (
              <Text>Sold out</Text>
            ) : (
              <Text
                as="span"
                className="flex items-center justify-center gap-2"
              >
                <span>Add to bag</span> <span>??</span>{' '}
                <Money
                  withoutTrailingZeros
                  data={selectedVariant.priceV2}
                  as="span"
                />
                {isOnSale && (
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant.compareAtPriceV2}
                    as="span"
                    className="opacity-50 strike"
                  />
                )}
              </Text>
            )}
          </Button>
        </AddToCartButton>

        <div>
          <Button
            width="full"
            variant={'primary'}
            as="span"
            onClick={()=>{addToWishlist()}}
          >
            <Text as="span" className="flex items-center justify-center gap-2">
              <span>{!addedToWishlist ? "Add to Wishlist" : "Added to Wishlist"}</span> 
            </Text>
          </Button>
        </div>
        {!isOutOfStock && <ShopPayButton variantIds={[selectedVariant.id]} />}
      </div>
    </form>
  );
}
