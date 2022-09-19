import {useEffect, useState} from 'react';
import swapi from '../../lib/swym-apikit/index';

import {Text, IconClose} from '~/components';

import "./index.css"

export function WishlistDetail() {
  const [wishlistData, setWishlistData] = useState([]);

  useEffect(() => {
    swapi
      .fetchListContent()
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setWishlistData(res.items);
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
