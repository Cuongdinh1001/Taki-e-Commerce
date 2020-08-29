export const discountByProduct = function (listOrderDetail, voucher) {
  const message = checkVoucher(voucher);
  if (message !== 'OK') return message;

  const orderDetail = listOrderDetail.find((product) => String(voucher.requirement.product.productId) === String(product.productId));

  if (voucher.requirement.product.minQuantity) {
    if (voucher.requirement.product.minQuantity > orderDetail.quantity) return `${voucher.discountCode}: So luong san pham khong du yeu cau`;
  }

  const prePrice = orderDetail.quantity * orderDetail.salePrice;

  if (voucher.requirement.product.minValue) {
    if (voucher.requirement.product.minValue > prePrice) return `${voucher.discountCode}: Gia tri don mua khong du yeu cau`;
  }

  const idx = listOrderDetail.indexOf(orderDetail);
  let postPrice = 0;
  let valueDiscount = 0;
  if (voucher.typeDiscount === 'direct') {
    valueDiscount = voucher.valueDiscount;
  } else {
    valueDiscount = prePrice * voucher.valueDiscount * 0.01;
    if (voucher.requirement.product.maxDiscount && voucher.requirement.product.maxDiscount < valueDiscount) valueDiscount = voucher.requirement.product.maxDiscount;
  }

  postPrice = orderDetail.postPrice - valueDiscount;
  if (postPrice >= 0) {
    listOrderDetail[idx].postPrice = postPrice;
  } else {
    valueDiscount = orderDetail.postPrice;
    listOrderDetail[idx].postPrice = 0;
  }

  if (listOrderDetail[idx].voucher) {
    listOrderDetail[idx].voucher.push({
      voucher: voucher._id,
      valueDiscount
    });
  } else {
    listOrderDetail[idx].voucher = [{
      voucherId: voucher._id,
      valueDiscount
    }];
  }
  return message;
};

export const discountByCategory = function (listOrderDetail, voucher) {
  const message = checkVoucher(voucher);
  if (message !== 'OK') return message;

  const listProductSameCategory = [];
  listOrderDetail.forEach((order) => {
    if (order.category == voucher.requirement.category.type) listProductSameCategory.push(order);
  });

  let prePriceOfCategory = 0;
  listProductSameCategory.forEach((order) => {
    prePriceOfCategory += order.salePrice * order.quantity;
  });

  if (voucher.requirement.category.minValue > prePriceOfCategory) return `${voucher.discountCode}:  Gia tri don mua khong du`;

  let remaining;
  if (voucher.typeDiscount === 'direct') {
    remaining = voucher.valueDiscount;
  } else {
    remaining = voucher.valueDiscount * prePriceOfCategory * 0.01;
  }

  listProductSameCategory.forEach((order) => {
    if (remaining == 0) return;

    const idx = listOrderDetail.indexOf(order);
    let { postPrice } = order;
    let valueDiscount = 0;

    if (postPrice - remaining < 0) {
      remaining -= postPrice;
      valueDiscount = postPrice;
      postPrice = 0;
    } else {
      postPrice -= remaining;
      valueDiscount = remaining;
      remaining = 0;
    }

    listOrderDetail[idx].postPrice = postPrice;

    if (valueDiscount !== 0) {
      if (listOrderDetail[idx].voucher) {
        listOrderDetail[idx].voucher.push({
          voucherId: voucher._id,
          valueDiscount
        });
      } else {
        listOrderDetail[idx].voucher = [{
          voucherId: voucher._id,
          valueDiscount
        }];
      }
    }
  });

  return message;
};

export const discountByOrder = function (listOrderDetail, voucher) {
  const message = checkVoucher(voucher);
  if (message !== 'OK') return message;

  let prePriceOfOrder = 0;
  listOrderDetail.forEach((order) => {
    prePriceOfOrder += order.salePrice * order.quantity;
  });

  if (voucher.requirement.order.minValue > prePriceOfOrder) return `${voucher.discountCode}: Gia tri don mua khong du`;

  let remaining = 0;
  if (voucher.typeDiscount === 'direct') remaining = voucher.valueDiscount;
  else {
    remaining = voucher.valueDiscount * 0.01 * prePriceOfOrder;
    if (voucher.requirement.order.maxDiscount && voucher.requirement.order.maxDiscount < remaining) { remaining = voucher.requirement.order.maxDiscount; }
  }

  listOrderDetail.forEach((order) => {
    if (remaining === 0) return;

    let { postPrice } = order;
    let valueDiscount = 0;
    if (postPrice - remaining > 0) {
      postPrice -= remaining;
      valueDiscount = remaining;
      remaining = 0;
    } else {
      remaining -= postPrice;
      valueDiscount = postPrice;
      postPrice = 0;
    }
    const idx = listOrderDetail.indexOf(order);
    listOrderDetail[idx].postPrice = postPrice;

    if (valueDiscount !== 0) {
      if (listOrderDetail[idx].voucher) {
        listOrderDetail[idx].voucher.push({
          voucherId: voucher._id,
          valueDiscount
        });
      } else {
        listOrderDetail[idx].voucher = [{
          voucherId: voucher._id,
          valueDiscount
        }];
      }
    }
  });

  return message;
};

const checkVoucher = function (voucher) {
  let message;
  if (voucher.status === 0) message = `${voucher.discountCode}: Voucher het hieu luc`;
  if (voucher.startTime > Date.now()) `${voucher.discountCode}: Van chua den thoi gian su dung Voucher`;
  if (voucher.endTime < Date.now()) `${voucher.discountCode}: Voucher da het han`;
  if (voucher.remaining === 0) `${voucher.discountCode}: So luong Voucher da het`;
  else message = 'OK';
  return message;
};
