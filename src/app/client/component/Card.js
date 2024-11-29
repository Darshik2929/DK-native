import {format} from 'date-fns';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Card, Chip} from 'react-native-paper';

export default function OrderCard({cardData}) {
      return (
            <Card style={styles.card}>
                  <Card.Content>
                        {cardData.product.map((product, productIndex) => (
                              <View
                                    key={productIndex}
                                    style={{...styles.productContainer, borderBottomWidth: cardData.product.length - 1 !== productIndex ? 1 : 0}}>
                                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                          <Text style={styles.productTitle}>{product?.id?.name}</Text>
                                          <Chip
                                                style={{...styles.infoChip, backgroundColor: '#3e4a57'}}
                                                textStyle={{...styles.infoChipText, color: 'white'}}>
                                                {product?.quantity} Qty.
                                          </Chip>
                                    </View>

                                    <Text
                                          style={{
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                color: '#5f6f78',
                                                marginBottom: 8,
                                          }}>
                                          Order ID : {cardData?.order_id}
                                    </Text>
                                    <View style={styles.infoRow}>
                                          <Chip style={{...styles.infoChip, backgroundColor: '#b2ebc5'}} textStyle={styles.infoChipText}>
                                                Box: {product.box.name}
                                          </Chip>
                                          <Chip style={{...styles.infoChip, backgroundColor: '#efca8f'}} textStyle={styles.infoChipText}>
                                                Color: {product.color.name}
                                          </Chip>
                                          {product.cartoon?.cartoonType?.name && (
                                                <Chip style={{...styles.infoChip}} textStyle={styles.infoChipText}>
                                                      Cartoon: {product.cartoon.cartoonType.name}
                                                </Chip>
                                          )}
                                    </View>

                                    {product.note && (
                                          <View style={styles.noteContainer}>
                                                <Text style={styles.noteText}>{product?.note}</Text>
                                          </View>
                                    )}
                              </View>
                        ))}

                        <View style={{backgroundColor: '#ccc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6}}>
                              <Text>Estimated Delivery Date :</Text>
                              <Text style={{fontWeight: '800', fontSize: 16}}>
                                    {format(cardData?.estimated_delivery_time, 'dd MMM yyyy, hh:mm a')}
                              </Text>
                        </View>
                  </Card.Content>
            </Card>
      );
}

const styles = StyleSheet.create({
      card: {
            marginVertical: 8,
            borderRadius: 12,
            elevation: 3,
            backgroundColor: '#FFF',
      },
      cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 12,
            marginLeft: -8,
      },
      subtitle: {
            fontSize: 14,
            color: '#888',
      },
      avatar: {
            fontWeight: 700,
            backgroundColor: '#e1bc9f',
      },
      productContainer: {
            marginVertical: 8,
            paddingBottom: 8,
            borderStyle: 'dashed',
            borderBottomColor: '#c4c4c4',
      },
      productTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#37474F',
            marginBottom: 8,
            // 5f6f78
      },
      infoRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            marginBottom: 8,
      },

      infoChip: {
            borderRadius: 20,
            margin: 4, // Added margin to space out the chips
      },
      infoChipText: {
            fontSize: 12,
            color: '#333',
      },
      divider: {
            marginVertical: 8,
      },
      tableScroll: {
            width: '100%',
            // shadowColor: "#000",
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.2,
            // shadowRadius: 1.41,
            // elevation: 2,
      },
      tableContainer: {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: '#bfbfbf',
            display: 'flex',
            // elevation: 3,
      },
      tableHeader: {
            backgroundColor: '#ECEFF1',
            // borderBottomWidth: 1,
            borderBottomColor: '#B0BEC5',
      },
      tableRow: {
            borderBottomWidth: 1,
            borderBottomColor: '#ECEFF1',
      },
      componentColumn: {
            width: '40%',
      },
      numericColumn: {
            width: '20%',
            justifyContent: 'center',
      },
      statusColumn: {
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
      },
      headerText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#37474F',
      },
      cellText: {
            fontSize: 14,
            color: '#455A64',
      },
      noteContainer: {
            marginVertical: 8,
            padding: 8,
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
      },
      noteTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 4,
      },
      noteText: {
            fontSize: 14,
            color: '#333',
      },
      cardActions: {
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            justifyContent: 'flex-end',
            paddingRight: 20,
            paddingLeft: 12,
      },
      actionButton: {
            marginHorizontal: 8,
      },
      button: {
            borderRadius: 8,
            flex: 1,
      },
});
