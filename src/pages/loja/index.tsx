import React, { useContext } from 'react';
import Head from 'next/head';
import { Container, Row } from 'react-bootstrap';

import type { GetServerSideProps, NextPage } from 'next';

import { Category, Product, ProductData } from '@interfaces';
import {
  BarCategorys,
  CardLoja,
  ProductFilter,
  TopBlockSection,
  CartShop,
} from '@components';

import Layout from '@layout';
import { CartContext } from '@contexts';

interface LojaProps {
  produtos: Product;
  categorias: Category;
}

const Loja: NextPage<LojaProps> = ({ produtos, categorias }) => {
  const [category, setCategory] = React.useState<number>(0);
  const [upperValue, setUpperValue] = React.useState<number>(100);

  const [FilteredProducts, setFilteredProducts] = React.useState<ProductData[]>(
    produtos.data,
  );

  const context = useContext(CartContext);

  const handleAddToCart = (produtoData: ProductData) => {
    const isProductInCart = context?.cartItems.find(
      (item) => item.item.id === produtoData.id,
    );

    if (isProductInCart) {
      context?.removeFromCart(isProductInCart);
    } else {
      // Se o produto não estiver no carrinho, adicione-o
      context?.addToCart({
        item: produtoData,
        price: produtoData.attributes.price,
        quantity: 1,
        size: null,
      });
    }
  };

  function filterProductsByPriceAndCategory(
    products: Product,
    upperValue: number,
    categoryId: number,
  ) {
    return products.data.filter((produto) => {
      const isCategoryMatch =
        categoryId === 0 ||
        (produto.attributes.categoria.data != null &&
          produto.attributes.categoria.data.id === categoryId);

      const isPriceMatch =
        produto.attributes.price < 50 ||
        (produto.attributes.price >= 50 &&
          produto.attributes.price <= upperValue);

      return isCategoryMatch && isPriceMatch;
    });
  }

  const handleFilterChange = (upperValue: number) => {
    setUpperValue(upperValue);
    const filteredProducts = filterProductsByPriceAndCategory(
      produtos,
      upperValue,
      category,
    );
    setFilteredProducts(filteredProducts);
  };

  function filterProductByCategory(categoryId: number) {
    setCategory(categoryId);
    const filteredByCategoryAndPrice = filterProductsByPriceAndCategory(
      produtos,
      upperValue,
      categoryId,
    );
    setFilteredProducts(filteredByCategoryAndPrice);
  }

  return (
    <>
      <Head>
        <title>Loja</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      {/*  top info */}

      <Layout bgColor="white" txColor={'black'}>
        <TopBlockSection.Root backgroud="./backgroud.jpg">
          <TopBlockSection.Title title="Bem-vindo à Loja Solidária da ASCOP" />
          <TopBlockSection.Paragrap
            paragrap="Explore nossa seleção única de produtos que não apenas trazem
            qualidade, mas também fazem a diferença. Ao comprar da nossa loja,
            você está apoiando diretamente nossos projetos e iniciativas de
            impacto social. Cada compra contribui para causar um impacto
            positivo nas vidas das pessoas e comunidades que atendemos. Obrigado
            por se juntar a nós nessa jornada de solidariedade e mudança!"
          />
        </TopBlockSection.Root>

        <Container>
          <section>
            <div className="categorias">
              <Row className="align-items-center">
                <BarCategorys
                  {...{ categorias }}
                  setCatgory={filterProductByCategory}
                />

                <CartShop />
              </Row>

              <ProductFilter
                {...{ produtos }}
                onFilterChange={handleFilterChange}
              />
            </div>

            {produtos && (
              <div className="main-card">
                <Row>
                  {FilteredProducts.map((produto) => (
                    <CardLoja
                      key={produto.id}
                      produto={produto}
                      onAddToCart={() => handleAddToCart(produto)}
                    />
                  ))}
                </Row>
              </div>
            )}

            {!FilteredProducts.length && <p>dados não caregados</p>}
          </section>
        </Container>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<LojaProps> = async () => {
  try {
    const [resProducts, resCategorys] = await Promise.all([
      fetch(`http://127.0.0.1:1337/api/produtos?populate=*`, {
        method: 'GET',
      }),
      fetch(`http://127.0.0.1:1337/api/categorias`, {
        method: 'GET',
      }),
    ]);

    const [repoProducts, repoCategorys] = await Promise.all([
      resProducts.json(),
      resCategorys.json(),
    ]);

    const produtos = repoProducts ? repoProducts : [];
    const categorias = repoCategorys ? repoCategorys : [];

    return {
      props: {
        produtos,
        categorias,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        produtos: [],
        categorias: [],
      },
    };
  }
};

export default Loja;
