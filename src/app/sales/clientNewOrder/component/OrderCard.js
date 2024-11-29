/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {format} from 'date-fns';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Card, Avatar, Button, Chip} from 'react-native-paper';

export default function OrderCard({cardData, cardActionButton}) {
      return (
            <Card style={styles.card}>
                  <Card.Title
                        title={cardData.client_id.name}
                        titleStyle={styles.cardTitle}
                        left={props => <Avatar.Text {...props} label={cardData.client_id.name[0]} style={styles.avatar} />}
                        right={props => (
                              <Text {...props} style={{marginRight: 10}}>
                                    {cardData?.deadline?.due_date && format(cardData?.deadline?.due_date, 'dd MMM yyyy hh:mm a')}
                              </Text>
                        )}
                  />
                  <Card.Content>
                        {cardData?.product?.map((product, productIndex) => (
                              <View
                                    key={productIndex}
                                    style={{
                                          ...styles.productContainer,
                                          borderBottomWidth: cardData.product.length - 1 !== productIndex ? 1 : 0,
                                    }}>
                                    <View
                                          style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                          }}>
                                          <Text style={styles.productTitle}>{product?.id?.name}</Text>
                                          <Chip
                                                style={{...styles.infoChip, backgroundColor: '#3e4a57'}}
                                                textStyle={{...styles.infoChipText, color: 'white'}}>
                                                {product.quantity} Qty.
                                          </Chip>
                                    </View>

                                    <View style={styles.infoRow}>
                                          <Chip style={{...styles.infoChip, backgroundColor: '#e8e6e6'}} textStyle={styles.infoChipText}>
                                                Color : {product?.color?.name}
                                          </Chip>
                                          <Chip style={{...styles.infoChip, backgroundColor: '#e8e6e6'}} textStyle={styles.infoChipText}>
                                                Box : {product?.box?.name}
                                          </Chip>
                                    </View>

                                    <View style={styles.infoRow}>
                                          {product?.cartoon?.cartoonType?.name && (
                                                <Chip style={{...styles.infoChip}} textStyle={styles.infoChipText}>
                                                      Cartoon: {product?.cartoon?.cartoonType?.name}
                                                </Chip>
                                          )}
                                          {product?.id?.sticker?.name && (
                                                <Chip style={{...styles.infoChip, backgroundColor: '#efca8f'}} textStyle={styles.infoChipText}>
                                                      Sticker : {product?.id?.sticker?.name}
                                                </Chip>
                                          )}
                                          {product?.id?.plastic_bag?.name && (
                                                <Chip style={{...styles.infoChip, backgroundColor: '#fef9c3'}} textStyle={styles.infoChipText}>
                                                      Plastic Bag : {product?.id?.plastic_bag?.name}
                                                </Chip>
                                          )}
                                    </View>

                                    {product.note && (
                                          <View style={styles.noteContainer}>
                                                <Text style={styles.noteText}>{product.note}</Text>
                                          </View>
                                    )}
                              </View>
                        ))}
                  </Card.Content>

                  <Card.Actions
                        style={{
                              ...styles.cardActions,
                              paddingVertical: 16,
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                        }}>
                        {cardActionButton.map((el, index) => {
                              return (
                                    <Button
                                          style={[styles.button, {flexShrink: 1, flexGrow: 1}]} // Allow buttons to shrink and grow
                                          key={index}
                                          buttonColor={index === 1 ? '#e1bc9f' : undefined}
                                          textColor={index === 1 ? '#3e4a57' : undefined}
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
      },
      subtitle: {
            fontSize: 14,
            color: '#888',
      },
      avatar: {
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
      },
      infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 8,
            flexWrap: 'wrap',
            gap: 6,
      },
      infoChip: {
            borderRadius: 20,
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
