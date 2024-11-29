import {format} from 'date-fns';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Card, Avatar, Button, Chip} from 'react-native-paper';

export default function BillingCard({cardData, cardActionButton}) {
      const cardStatus = {bill: cardData?.uploads?.some(card => card.type === 'bill'), bilty: cardData?.uploads?.some(card => card.type === 'bilty')};

      return (
            <Card style={styles.card}>
                  <View
                        style={{
                              borderBottomWidth: 0,
                              backgroundColor: '#f0f0f0',
                              borderColor: '#e0dede',
                              marginBottom: 5,
                              borderTopLeftRadius: 10,
                              borderTopRightRadius: 10,
                        }}>
                        <Card.Title
                              title={cardData?.client_id?.name}
                              titleStyle={styles.cardTitle}
                              style={{backgroundColor: 'faf5f5', marginVertical: -10, fontWeight: 600}}
                              left={props => <Avatar.Text {...props} label={cardData?.client_id?.name?.[0]} size={35} style={styles.avatar} />}
                        />
                  </View>

                  <Text style={{fontSize: 16, fontWeight: 'bold', color: '#5f6f78', marginBottom: 8, marginLeft: 16}}>
                        {cardData?.estimated_delivery_time
                              ? format(cardData?.estimated_delivery_time, 'dd MMM yyyy hh:mm a')
                              : cardData?.deadline?.due_date && format(cardData?.deadline?.due_date, 'dd MMM yyyy hh:mm a')}
                  </Text>

                  <Text
                        style={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              color: '#5f6f78',
                              marginBottom: 8,
                              marginLeft: 16,
                        }}>
                        Order ID : {cardData?.order_id}
                  </Text>

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

                                    <View style={{padding: 12, borderWidth: 1, borderRadius: 9, borderColor: '#ccc'}}>
                                          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 13}}>
                                                      <Text style={{fontWeight: 800, fontSize: 13}}>Bill : </Text>
                                                      <View
                                                            style={{
                                                                  backgroundColor: cardStatus.bill ? '#8dc559' : '#bc3437',
                                                                  height: 10,
                                                                  width: 10,
                                                                  borderRadius: 999,
                                                            }}
                                                      />
                                                </View>
                                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                                      <Text style={{fontWeight: 800, fontSize: 13}}>Bilty : </Text>
                                                      <View
                                                            style={{
                                                                  backgroundColor: cardStatus.bilty ? '#8dc559' : '#bc3437',
                                                                  height: 10,
                                                                  width: 10,
                                                                  borderRadius: 999,
                                                            }}
                                                      />
                                                </View>
                                          </View>
                                    </View>

                                    {product.note && (
                                          <View style={styles.noteContainer}>
                                                <Text style={styles.noteText}>{product?.note}</Text>
                                          </View>
                                    )}
                              </View>
                        ))}
                  </Card.Content>

                  <Card.Actions
                        style={{
                              ...styles.cardActions,
                              paddingVertical: 16,
                              paddingLeft: cardActionButton.length ? 12 : 0,
                              paddingRight: cardActionButton.length ? 20 : 0,
                              flexDirection: 'column',
                              flexWrap: 'wrap',
                        }}>
                        {cardActionButton.map((el, index) => {
                              if (el.label == 'Complete' && !cardStatus.bill) {
                                    return null;
                              }

                              if (el.label == 'Reject' && cardStatus.bill) {
                                    return null;
                              }

                              if (!!cardStatus.bill && !!cardStatus.bilty && (el.label == 'Reject' || el.label == 'Attach')) {
                                    return null;
                              }

                              if (!(!!cardStatus.bill && !cardStatus.bilty) && el.label === 'Attach Bilty Later') {
                                    return null;
                              }

                              return (
                                    <Button
                                          style={[styles.button, {flexShrink: 1, flexGrow: 1, width: '100%', marginTop: 5}]}
                                          key={index}
                                          buttonColor={index === 1 ? '#e1bc9f' : undefined}
                                          textColor={index == 1 ? '#3e4a57' : undefined}
                                          onPress={() => el.handle(cardData)}
                                          contentStyle={{paddingHorizontal: 0}}>
                                          {el.label}
                                    </Button>
                              );
                        })}
                  </Card.Actions>
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
