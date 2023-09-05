import React from 'react';
import Head from 'next/head';
import { useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { Minus, Plus } from 'lucide-react';
import type { NextPage } from 'next';

import Layout from '@layout';
import { CartContext, CartItem } from '@contexts';
import { Section } from './styles';
import { Alert, Button } from '@components';

const Carrinho: NextPage = () => {
  const [isError, setError] = React.useState<boolean>(false);
  const router = useRouter();

  const context = useContext(CartContext);

  const handleSizeChange = (cartItem: CartItem, size: string) => {
    if (cartItem && size) {
      context?.updateToCart({
        item: cartItem.item,
        price: cartItem.item.attributes.price,
        quantity: cartItem.quantity,
        size: size,
      });
    }
  };

  const handleCheckout = () => {
    const checkCart = context?.cartItems.filter(
      (cart) => cart.item.attributes.sizes.length > 1 && cart.size === null,
    );
    if (checkCart?.length != 0) {
      return setError(true);
    }

    router.push('/loja/cliente');
  };

  return (
    <>
      <Head>
        <title>Loja</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <Layout bgColor="white" txColor="black" staticmenu>
        <Section>
          <Container>
            <Row className="justify-content-around">
              <Col xs={12} lg={6}>
                <Col xs={12}>
                  <h2>Carrinho:</h2>
                  <p>confirme os produtos e tamanhos para finalizar a compra</p>
                </Col>
                <ul className="list-products ">
                  {context?.cartItems.map((product) => (
                    <li
                      key={product.item.id}
                      className="product  d-flex justify-content-between"
                    >
                      <div className="d-flex">
                        <div className="img-product ">
                          <Image
                            width={115}
                            height={115}
                            src={
                              product.item.attributes.thumbnail.data.attributes
                                .url
                            }
                            alt="produto ASCOP"
                            className="img-fluid"
                          />
                        </div>
                        <div className="info-product mr-3">
                          <div className="title">
                            <h4>{product.item.attributes.title}</h4>
                          </div>
                          <div className="price">
                            <h4>
                              R${' '}
                              <strong>{product.item.attributes.price} </strong>
                            </h4>
                          </div>
                          <div className="sizes mb-3">
                            {product.size != null || product.size ? (
                              <p>
                                Tamanho: <strong>{product.size}</strong>{' '}
                              </p>
                            ) : product.item.attributes.sizes.length === 1 ? (
                              <p>
                                Tamanho:{' '}
                                <strong>
                                  {product.item.attributes.sizes.map(
                                    (size) => size.variations,
                                  )}
                                </strong>
                              </p>
                            ) : null}

                            {!product.size &&
                              product.item.attributes.sizes.length > 1 && (
                                <Form>
                                  <Form.Group controlId="productSize">
                                    <Form.Label>Tamanho</Form.Label>
                                    <div className="col-auto">
                                      <Form.Control
                                        as="select"
                                        onChange={(e) =>
                                          handleSizeChange(
                                            product,
                                            e.target.value,
                                          )
                                        }
                                        className={isError ? 'error' : ''}
                                      >
                                        <option value="">
                                          Selecione um tamanho
                                        </option>
                                        {!product.size &&
                                          product.item.attributes.sizes.map(
                                            (size) =>
                                              !context?.cartItems.some(
                                                (item) =>
                                                  item.size === size.variations,
                                              ) && (
                                                <option
                                                  key={size.id}
                                                  value={size.variations}
                                                  className={
                                                    isError ? 'error-text' : ''
                                                  }
                                                >
                                                  {size.variations}
                                                </option>
                                              ),
                                          )}
                                      </Form.Control>
                                    </div>
                                  </Form.Group>
                                </Form>
                              )}
                          </div>
                          <div className="color mb-3">
                            <p>
                              Cor:<strong>Única</strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="action-product d-flex justify-content-between align-items-center">
                        <button
                          onClick={() => context?.removeFromCart(product)}
                        >
                          <Minus />
                        </button>

                        <h5>{product.quantity}</h5>
                        <button onClick={() => context?.addToCart(product)}>
                          <Plus />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Col>

              <Col xs={12} lg={5} className="info-conatiner d-none d-lg-block">
                <div className="info-products ">
                  <div className="items-info">
                    <h3>Items selecionados</h3>
                    <div
                      className="total d-flex justify-content-between
                         my-2"
                    >
                      <div>
                        <h4>Produtos</h4>
                      </div>
                      <div>
                        <p>{context?.getCartTotalQuantity()}</p>
                      </div>
                    </div>
                    <div className="rodape">
                      <div
                        className="total d-flex justify-content-between
                         my-2"
                      >
                        <div>
                          <h3>Total: </h3>
                        </div>
                        <div>
                          <h2>R$ {context?.getCartTotal()} </h2>
                        </div>
                      </div>

                      <div className="finalizar">
                        <Button
                          className="w-100"
                          text="COMPRAR"
                          theme={false}
                          onClick={handleCheckout}
                          disabled={isError}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>

          <Col xs={12} lg={5} className="info-conatiner my-3 d-lg-none">
            <div className="info-products ">
              <div className="items-info">
                <h3>Items selecionados</h3>
                <div
                  className="total d-flex justify-content-between
                         my-2"
                >
                  <div>
                    <h4>Produtos</h4>
                  </div>
                  <div>
                    <p>{context?.getCartTotalQuantity()}</p>
                  </div>
                </div>
                <div className="rodape">
                  <div
                    className="total d-flex justify-content-between
                         my-2"
                  >
                    <div>
                      <h3>Total: </h3>
                    </div>
                    <div>
                      <h2>R$ {context?.getCartTotal()} </h2>
                    </div>
                  </div>

                  <div className="finalizar">
                    <Button
                      className="w-100"
                      text="COMPRAR"
                      theme={false}
                      onClick={handleCheckout}
                      disabled={isError}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Section>

        {isError && (
          <Alert
            message="  Por favor selecione o tamanhos dos produtos com valores
                variaveis"
            show={isError}
            type="error"
            onClose={() => setError(false)}
          />
        )}

        {!context && <p>Erro ao obter os dados do carrinho</p>}
      </Layout>
    </>
  );
};

export default Carrinho;
