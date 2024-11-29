/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {format} from 'date-fns';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text, Card, Avatar, Button, Chip, DataTable} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TaskCard({cardData, cardActionButton, dontShowComponent}) {
      const renderStatusIcon = status => {
            const color = status === 'ready' ? '#8dc559' : '#bc3437';
            return <Icon name="circle" size={16} color={color} />;
      };

      const checkProductAvailability = () => {
            return cardData?.product?.every(product => {
                  const requiredQuantity = product?.quantity;

                  return product?.components?.every(component => {
                        const requiredComponentQuantity = requiredQuantity * component?.quantity;

                        return component?.id?.quantity >= requiredComponentQuantity;
                  });
            });
      };

      const isAllPartsAvailable = checkProductAvailability(cardData);

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

                                    <View style={styles.infoRow}>
                                          <Chip style={{...styles.infoChip, backgroundColor: '#e8e6e6'}} textStyle={styles.infoChipText}>
                                                Color : {product?.color?.name}
                                          </Chip>
                                          <Chip style={{...styles.infoChip, backgroundColor: '#e8e6e6'}} textStyle={styles.infoChipText}>
                                                Box : {product?.box?.name}
                                          </Chip>
                                    </View>

                                    {!dontShowComponent && (
                                          <ScrollView style={styles.tableScroll}>
                                                <View style={styles.tableContainer}>
                                                      <DataTable>
                                                            <DataTable.Header style={styles.tableHeader}>
                                                                  <DataTable.Title style={{flex: 2}}>
                                                                        <Text style={styles.headerText}>Part</Text>
                                                                  </DataTable.Title>
                                                                  <DataTable.Title numeric style={{justifyContent: 'center'}}>
                                                                        <Text style={styles.headerText}>Stock</Text>
                                                                  </DataTable.Title>
                                                                  <DataTable.Title numeric style={{justifyContent: 'center'}}>
                                                                        <Text style={styles.headerText}>Order</Text>
                                                                  </DataTable.Title>
                                                                  <DataTable.Title style={{marginLeft: 10, marginRight: -10}}>
                                                                        <Text style={styles.headerText}>Status</Text>
                                                                  </DataTable.Title>
                                                            </DataTable.Header>

                                                            {product.components.map((item, index) => (
                                                                  <DataTable.Row key={index} style={styles.tableRow}>
                                                                        <DataTable.Cell style={{...styles.componentColumn, flex: 2}}>
                                                                              <Text style={styles.cellText}>{item?.id?.name}</Text>
                                                                        </DataTable.Cell>
                                                                        <DataTable.Cell numeric style={{...styles.numericColumn}}>
                                                                              <Text style={styles.cellText}>{item?.id?.quantity}</Text>
                                                                        </DataTable.Cell>
                                                                        <DataTable.Cell numeric style={{...styles.numericColumn}}>
                                                                              <Text style={styles.cellText}>
                                                                                    {item?.quantity * product?.quantity}
                                                                              </Text>
                                                                        </DataTable.Cell>
                                                                        <DataTable.Cell style={{...styles.statusColumn}}>
                                                                              {renderStatusIcon(
                                                                                    item?.quantity * product?.quantity <= item?.id?.quantity
                                                                                          ? 'ready'
                                                                                          : 'not-ready',
                                                                              )}
                                                                        </DataTable.Cell>
                                                                  </DataTable.Row>
                                                            ))}
                                                      </DataTable>
                                                </View>
                                          </ScrollView>
                                    )}

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
                              flexDirection: 'row',
                              flexWrap: 'wrap', // Allow buttons to wrap if needed
                        }}>
                        {cardActionButton.map((el, index) => {
                              if (el.label === 'Pending' && isAllPartsAvailable) {
                                    return null;
                              }

                              const isSendPackaging = isAllPartsAvailable && el.label === 'Active';

                              return (
                                    <Button
                                          style={[styles.button, {flexShrink: 1, flexGrow: 1}]}
                                          key={index}
                                          buttonColor={index === 1 ? '#e1bc9f' : undefined}
                                          textColor={index == 1 ? '#3e4a57' : undefined}
                                          onPress={() => el.handle(cardData, isAllPartsAvailable)}
                                          contentStyle={{paddingHorizontal: 0}}>
                                          {isSendPackaging ? 'Send Packaging' : el.label}
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
            // width: '40%',
      },
      numericColumn: {
            // width: '10%',
            justifyContent: 'center',
      },
      statusColumn: {
            // width: '20%',
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
