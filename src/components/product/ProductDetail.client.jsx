// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import {Disclosure} from '@headlessui/react';
import {useEffect} from 'react';
import {Link} from '@shopify/hydrogen';
import swapi from '../../lib/swym-apikit';

import {Text, IconClose} from '~/components';

/* const swapi = function (pid, endpoint){
  this.pid = pid,
  this.endpoint = endpoint
}

//var token = jwt.sign({ foo: 'bar' }, '5h3hT7hMOLwMan8ktVubhMNmMmaeLSUXNiiksMiYttekLaJ6k1GjJMcntqh4G1OpYTUlBmW58r82duwQJF-P1w');

swapi.prototype.getUserIds = async function () {
  fetch('http://localhost:5000/test', {method: 'POST'}).then((res) => {
    console.log(res);
  });
} */

export function ProductDetail({title, content, learnMore}) {
  useEffect(() => {
    //var decoded = jwt.verify(token, '5h3hT7hMOLwMan8ktVubhMNmMmaeLSUXNiiksMiYttekLaJ6k1GjJMcntqh4G1OpYTUlBmW58r82duwQJF-P1w');
    //console.log(token, decoded);
    /* fetch('http://localhost:5000/createList', {
      method: 'POST',
      body: JSON.stringify({lname: 'test list'}),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      console.log(res);
    }); */

    /* swapi
      .createList({
        lname: 'test list 2',
        regid: "_2Ao-DIf3Bwy2j8btPLYgAiLHkDrQHDanAXXptGB7JmBBtV5J0qCZKSpwi9CzdNPAxt67bB4UdH_SWhlpCPbVobnPfY0qlizwJwc9rrDr7E1q2s4RQLUCoWoMjenpDorf8Tfvn4ytfUUiIKMvtv72hqnZ4R21PKSdwIxuHFrJq5-DRSRPFwhJDbkmiCRmma3ewvgWBP2zKAJCML9XJjNZmLOAr6HDVH8OuG_5Pypkes",
        sessionid: '137e1261-eace-48cf-b9ac-958484e7c37f-API'
      })
      .then((res) => {
        console.log(res);
      }); */

      /* refreshSwymConfig(null).then((res) => {
        console.log(res);
      }); */

      swapi.createList({lname: "testing 123"}).then((res) => {
        console.log(res);
      });

      swapi.fetchLists().then((res) => {
        console.log(res);
      });

      swapi.updateListCtx({
        lid: "0d750bad-ea7d-4e82-908d-d4d7bdbd25c1",
        "a": [
          {
            "empi":"6635874517249",
            "du": "http://localhost:3000/products/14k-wire-bloom-earrings",
            "epi": "39463179256065"
          }
        ]
      }).then((res) => {
        console.log(res);
      });
  }, []);

  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2">
      {/* @ts-expect-error @headlessui/react incompatibility with node16 resolution */}
      {({open}) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between">
              <Text size="lead" as="h4">
                {title}
              </Text>
              <IconClose
                className={`${
                  open ? '' : 'rotate-[45deg]'
                } transition-transform transform-gpu duration-200`}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{__html: content}}
            />
            {learnMore && (
              <div className="">
                <Link
                  className="pb-px border-b border-primary/30 text-primary/50"
                  to={learnMore}
                >
                  Learn more
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
