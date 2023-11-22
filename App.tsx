import React, {ReactElement, useEffect, useState} from 'react';
import {
  Button,
  EmitterSubscription,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useInAppPurchases from './src/hooks/useInAppPurchases';
import {Product} from 'react-native-iap';

function App(): ReactElement {
  const {init, finish, purchase, getSelectProducts} = useInAppPurchases();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let updateSub: EmitterSubscription | undefined;
    let errorSub: EmitterSubscription | undefined;

    init().then(({updateSub: initUpdate, errorSub: initError}) => {
      updateSub = initUpdate;
      errorSub = initError;

      getSelectProducts().then(products => {
        if (products instanceof Array) {
          setProducts(products);
        }
      });
    });

    return () => finish(updateSub, errorSub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressPurchase = async () => {
    const sku = 'shiro_corgi_001';
    await purchase(sku);
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.flexCenter}>
          <Text style={styles.title}>In App Purchases</Text>
        </View>
        <View style={{marginVertical: 'auto'}}>
          <Button onPress={onPressPurchase} title={'Buy Shiro Corgi'} />
        </View>
        <View>
          <Text>
            In-App Purchase Items Found: <Text>{products.length}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'lato',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
