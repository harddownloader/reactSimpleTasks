import React, { Component } from 'react';

import './CartItem.scoped.scss'

/**
 * товар в списке товоров в корзине
 */
class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
      qta: 1,
      totalProductsPrice: props.product.price
    }
  }

  /**
   * отлавливаем изменение пропсов(происходит при изменении qta и удалении товара)
   * @param {*} nextProps 
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.product !== nextProps.product) {
      // и заменяем стейт новыми пропсами, бо иначе остался бы старый стейт, а почему то старый стейт - это стейт удаленного товара, только стейт, пропсы при этом нормальные
      this.setState({
        product: nextProps.product,
        qta: nextProps.product.qta,
        originalPrice: nextProps.product.originalPrice,
        totalProductsPrice: nextProps.product.totalProductsPrice
      });
      // console.log('been changed')
    }
  }

  componentDidMount() {
    console.log('product state', this.state.product)
    // при добалении компонента
    // пересчитываем итоговую сумму заказа в родителе
    this.props.changeAllSum()
  }

  /**
   * метод сообщающий корзинке(родителю) про событие удаления товара из корзины
   * @param {*} product 
   */
  deleteProductFromCart = (product) => {
    this.props.deleteProductFunc(product)
  }

  /**
   * метод изменения значения кол-ва
   * @param {String} type - делаем +1('plus') к кол-ву или -1('minus') к кол-ву товара
   */
  changeQtaCount = (type) => {
    // берем кол-во со стейта
    let qta = this.state.qta;

    // для -1 от кол-ва
    if (type === 'minus') {
      const qtaMinus = this.checkQtaLimit(qta-1);
      this.setState({qta: qtaMinus})

      // получем ценну за все кол-во этого товара(цена*кол-во)
      const finalPriceForProduct = Number(this.state.product.price) * qtaMinus
      // сохраняем новую общую цену для товара и после передаем эту информацию родителю
      this.setState({totalProductsPrice: finalPriceForProduct}, function() {
        console.log('changeQtaCount qta', this.state.qta )
        // передаем информацию об обновлении родителю
        this.props.updateCurrentProductData({
          sku: this.state.product.sku,
          imageAlt: this.state.product.imageAlt,
          imageUrl: this.state.product.imageUrl,
          name: this.state.product.name,
          price: this.state.product.price,
          originalPrice: this.state.product.originalPrice,
          qta: this.state.qta,
          totalProductsPrice: this.state.totalProductsPrice
        })
      })
  
    // для +1 к кол-ву
    } else if (type === 'plus') {
      qta = Number(qta) + 1 
      this.setState({qta: qta})

      // получем цену за все кол-во этого товара(цена*кол-во)
      const finalPriceForProduct = Number(this.state.product.price) * qta
      // сохраняем новую общую цену для товара и после передаем эту информацию родителю
      this.setState({totalProductsPrice: finalPriceForProduct}, function() {
        console.log('changeQtaCount qta', this.state.qta )
        console.log('changeQtaCount state', this.state)
        // передаем информацию об обновлении родителю
        this.props.updateCurrentProductData({
          sku: this.state.product.sku,
          imageAlt: this.state.product.imageAlt,
          imageUrl: this.state.product.imageUrl,
          name: this.state.product.name,
          price: this.state.product.price,
          originalPrice: this.state.product.originalPrice,
          qta: this.state.qta,
          totalProductsPrice: this.state.totalProductsPrice,
        })
      })
    } else {
      console.log(`Error: incorrect type, type = ${type}`)
    }
  }
  
  /**
   * метод устанавливает лимиты для поля кол-ва товара
   * чтобы нельзя было загруть кол-во ниже 1
   * и чтобы кол-во было не больше 100
   * @param {Number} qta - кол-во товара
   */
  checkQtaLimit = (qta) => {
      if (qta < 1) {
          return 1;
      } else if (qta >= 100) {
          return 100;
      } else {
          return qta;
      }
  }

  render() {
    return(
      <div className="list-item">
        <div className="product-buttons">
          {/* кнопка удаления */}
          <span className="delete-btn btn" onClick={this.deleteProductFromCart.bind(this, this.props.product)}></span>
        </div>
        <div className="product-img">
          {/* фото товара */}
          <img src={this.props.product.imageUrl} alt={this.props.product.imageAlt} width="75px" />
        </div>
        <div className="product-name">
          {/* название товара */}
          <span>{this.props.product.name}</span>
        </div>
        <div className="product-quantity">
          {/* кнопка на добавление кол-ва товара */}
          <button className="plus-btn" type="button" name="button" onClick={this.changeQtaCount.bind(this, 'plus')}>
            <img src="/assets/icons/plus.svg" alt="" />
          </button>

          {/* выводим общее кол-во товара
            p.s. ставим <span>, а не <input> чтобы было безопаснее */}
          <span>{this.state.qta}</span>

          {/* кнопка на уменьшение кол-ва товара */}
          <button className="minus-btn" type="button" name="button" onClick={this.changeQtaCount.bind(this, 'minus')}>
            <img src="/assets/icons/minus.svg" alt="" />
          </button>
        </div>
        {/* итоговая цена за товар(кол-во*цену) */}
        <div className="product-cost">{this.state.totalProductsPrice} рублей</div>
      </div>
    )
  }
}

export default CartItem;
