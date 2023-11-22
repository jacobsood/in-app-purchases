import {
  flushFailedPurchasesCachedAsPendingAndroid,
  initConnection,
  purchaseUpdatedListener,
  finishTransaction,
  purchaseErrorListener,
  type PurchaseError,
  type ProductPurchase,
  requestPurchase,
  getProducts,
} from 'react-native-iap';
import {EmitterSubscription} from 'react-native';

const useInAppPurchases = () => {
  const init = async () => {
    await initConnection();

    // Remove any "ghost" pending payments
    await flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
      // Pending purchases that are still pending. Do nothing here.
    });

    // listeners
    const updateSub = purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        console.log('purchaseUpdatedListener', purchase);
        const receipt = purchase.transactionReceipt;

        if (receipt) {
          // call internal api to deliver the purchase to the user.

          // if internal api successful, let store know that we have delivered what has been paid for.
          // consumable means this can be purchased multiple times over
          await finishTransaction({purchase, isConsumable: false});

          // Otherwise, the user will be refunded. Here we can retry or conclude the purchase is fraudulent, etc...
        }
      },
    );

    const errorSub = purchaseErrorListener((error: PurchaseError) => {
      console.warn('purchaseErrorListener', error);
    });

    return {updateSub, errorSub};
  };

  const finish = (
    purchaseUpdateSub?: EmitterSubscription,
    purchaseErrorSub?: EmitterSubscription,
  ) => {
    if (purchaseUpdateSub) {
      purchaseUpdateSub.remove();
    }

    if (purchaseErrorSub) {
      purchaseErrorSub.remove();
    }
  };

  const getSelectProducts = async () => {
    return await getProducts({skus: ['shiro_corgi_001']}).catch(() => {
      console.log('Could not find products');
    });
  };

  const purchase = async (sku: string) => {
    try {
      await requestPurchase({
        sku,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
    } catch (err) {
      console.warn('Something went wrong with the purchase', err);
    }
  };

  return {
    init,
    finish,
    purchase,
    getSelectProducts,
  };
};

export default useInAppPurchases;
