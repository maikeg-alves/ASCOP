import type { NextPage } from 'next';
import Head from 'next/head';
import { Main } from '@layout';

import { useRouter } from 'next/router';
import { Product as IProduct, Product } from '@interfaces';
import React, { useContext } from 'react';
import { Container } from './styles';
import { ShoppingCart } from 'lucide-react';
import { CartContext } from '@contexts';
import { CartShop } from '../styles';
import Image from 'next/image';

const Producto: NextPage = () => {
  const router = useRouter();
  const { product } = router.query;
  const [produtos, setProdutos] = React.useState<IProduct[]>([]);
  const [size, setSize] = React.useState<string>();
  const [quantity, setQuantity] = React.useState<number>(1);
  const [error, setError] = React.useState<boolean>(false);
  const [isCartOpen, setCartOpen] = React.useState(false);

  const context = useContext(CartContext);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = (produto: Product) => {
    if (size != undefined) {
      return context?.addToCart({
        item: produto,
        price: produto.attributes.price,
        quantity: 1,
        size: size,
      });
    }

    return setError(true);
  };

  const handleRedirect = (produto: Product) => {
    handleAddToCart(produto);
    if (error && size) {
      return router.push('/loja/cliente/carrinho');
    }
  };

  const handleCartToggle = () => {
    setSize(undefined);
    setCartOpen(!isCartOpen);
  };

  React.useEffect(() => {
    if (typeof product == 'string') {
      const parsedProduct = JSON.parse(product);
      setProdutos([parsedProduct]);
    }
  }, [product]);

  console.log('size setado > ', size);

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Main>
        <section style={{ backgroundColor: 'white', textAlign: 'center' }}>
          <Container>
            {/*  barra superior  */}
            <div className="bar">
              <div className="voltar">
                <button onClick={() => router.push('/loja')}>Voltar</button>
              </div>

              <div className="cart" onClick={handleCartToggle}>
                <span className="accout">{context?.cartItems.length}</span>
                <div className="icon-cart">
                  <ShoppingCart />
                </div>
              </div>
            </div>

            {/* informaçoes do produto */}
            {produtos &&
              produtos.map((produto) => {
                return (
                  <>
                    <div className="product-imgens">
                      <div className="main-image"></div>
                    </div>
                    <div className="prodoct-infos">
                      <div className="title">
                        <h3>{produto.attributes.title}</h3>
                      </div>
                      <div className="description">
                        <p>{produto.attributes.description}</p>
                      </div>
                      <div className="price">
                        <p>R${produto.attributes.price}</p>
                      </div>
                      <div className="sizes">
                        <div className="label">
                          <h4>Tamanhos </h4>
                        </div>
                        <ul>
                          {produto.attributes.sizes.map((variables) => (
                            <li
                              key={variables.id}
                              onClick={() => setSize(variables.variations)}
                            >
                              {variables.variations}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="quatity my-3">
                        Quantidade: {quantity}
                        <div className="addandremove">
                          <button onClick={decrementQuantity}>-</button>
                          <button onClick={incrementQuantity}>+</button>
                        </div>
                      </div>
                      <div className="buttons">
                        <button onClick={() => handleRedirect(produto)}>
                          Compra
                        </button>
                        <button onClick={() => handleAddToCart(produto)}>
                          Add ao carrinho
                        </button>
                      </div>
                    </div>
                  </>
                );
              })}

            {!produtos.length && <p>produto não encontrado</p>}
            {error && <p>porfavor selecione um tamanho</p>}
          </Container>
        </section>

        {/* carrinho de compra */}
        <CartShop isOpen={isCartOpen}>
          <div className="close">
            <div>
              <h4>Carrinho:</h4>
            </div>
            <button onClick={handleCartToggle}>fechar</button>
          </div>
          <ul>
            {context?.cartItems.map((product) => (
              <li key={product.item.id}>
                <div>
                  <div>
                    <Image
                      width={50}
                      height={50}
                      src={
                        product.item.attributes.thumbnail.data.attributes.url
                      }
                      alt="produto ASCOP"
                    />
                  </div>
                  <h3>{product.item.attributes.title}</h3>
                  <p>
                    tamanho:{' '}
                    {product.size != null
                      ? product.size
                      : product.item.attributes.sizes.length > 1
                      ? 'N/I'
                      : 'UNICO'}
                  </p>
                  <p>{product.item.attributes.price}</p>
                </div>
                <div>
                  <button onClick={() => context.addToCart(product)}> +</button>
                  {product.quantity}
                  <button onClick={() => context.removeFromCart(product)}>
                    -
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="valototal">
            <div>
              <h3>Valor total:</h3>
            </div>
            <h2>R$ {context?.getCartTotal()}</h2>
            <button onClick={() => router.push('/loja/cliente/carrinho')}>
              Finalizar Compra
            </button>
          </div>
        </CartShop>
      </Main>
    </>
  );
};

export default Producto;