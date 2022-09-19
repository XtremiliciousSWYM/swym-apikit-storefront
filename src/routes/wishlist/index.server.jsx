import {Suspense} from 'react';
import {WishlistDetail} from '../../components/wishlist';
import {Section} from '~/components';
import {Layout} from '~/components/index.server';

export default function WishlistUI() {
  return (
    <Layout>
      <Section>
        <Suspense>
          <WishlistDetail />
        </Suspense>
      </Section>
    </Layout>
  );
}
