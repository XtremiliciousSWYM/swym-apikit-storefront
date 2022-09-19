import {useEffect, useState} from 'react';
import swapi from 'swym-apikit-test';

import {Text, IconClose} from '~/components';

import "./index.css"

export function WishlistDetail() {
  const [wishlistData, setWishlistData] = useState([]);

  useEffect(() => {
    swapi
      .fetchLists()
      .then((response) => {
        console.log(response, "RES")
        return response.json()})
      .then((res) => {
        console.log(res);
        const defaultList = res.filter(r=>{
            return r.lname == "My Wishlist"
        })
        console.log(defaultList)
        setWishlistData(defaultList[0].listcontents);
      });

  }, []);

  console.log(wishlistData, 'data');

  return (
    <div className="product-grid">
      {wishlistData.map((item) => (
        <div className="product-item">
            <div className="product-image-wrapper"><img src={item.iu}></img></div>
            <div className="product-title">{item.dt}</div>
            <div className="product-price">${item.pr}</div>
        </div>
      ))}
    </div>
  );
}
