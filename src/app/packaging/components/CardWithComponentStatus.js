import {format} from 'date-fns';
import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {DataTable, Text, Card, Button, Avatar, Chip} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CardWithComponentStatus({cardData, pressStart, actionButtonTitle, showActionButton}) {
      return (
            <>
                  <Card mode="elevated" style={styles.card}>
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
                              {cardData?.product?.map((detail, index) => (
                                    <View
                                          key={index}
                                          style={{...styles.productContainer, borderBottomWidth: cardData.product.length - 1 !== index ? 1 : 0}}>
                                          <View
                                                style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      flexDirection: 'row',
                                                      justifyContent: 'space-between',
                                                }}>
                                                <Text style={styles.productTitle}>{detail.id.name}</Text>
                                                <Chip
                                                      style={{...styles.infoChip, backgroundColor: '#3e4a57'}}
                                                      textStyle={{...styles.infoChipText, color: 'white'}}>
                                                      {detail.quantity} Qty.
                                                </Chip>
                                          </View>

                                          <View style={styles.infoRow}>
                                                <Chip style={{...styles.infoChip, backgroundColor: '#b2ebc5'}} textStyle={styles.infoChipText}>
                                                      Box: {detail.box.name}
                                                </Chip>
                                                {detail.cartoon?.cartoonType?.name && (
                                                      <Chip style={{...styles.infoChip}} textStyle={styles.infoChipText}>
                                                            Cartoon: {detail.cartoon.cartoonType.name}
                                                      </Chip>
                                                )}
                                                <Chip style={{...styles.infoChip, backgroundColor: '#efca8f'}} textStyle={styles.infoChipText}>
                                                      {detail.id.sticker.name}
                                                </Chip>
                                                <Chip style={{...styles.infoChip, backgroundColor: '#fef9c3'}} textStyle={styles.infoChipText}>
                                                      {detail.id.plastic_bag.name}
                                                </Chip>
                                          </View>

                                          <ScrollView style={styles.tableScroll}>
                                                <View style={styles.tableContainer}>
                                                      <DataTable>
                                                            <DataTable.Header style={styles.tableHeader}>
                                                                  <DataTable.Title style={styles.componentColumn}>
                                                                        <Text style={styles.headerText}>Item</Text>
                                                                  </DataTable.Title>
                                                                  <DataTable.Title numeric style={styles.numericColumn}>
                                                                        <Text style={styles.headerText}>Stock</Text>
                                                                  </DataTable.Title>
                                                                  <DataTable.Title numeric style={styles.numericColumn}>
                                                                        <Text style={styles.headerText}>Order</Text>
                                                                  </DataTable.Title>
                                                                  <DataTable.Title style={styles.statusColumn}>
                                                                        <Text style={styles.headerText}>Status</Text>
                                                                  </DataTable.Title>
                                                            </DataTable.Header>

                                                            {['Box', 'Cartoon', 'Sticker', 'Plastic Bag'].map((itemName, i) => {
                                                                  let available, required;
                                                                  let isConditionMet = false;
                                                                  switch (itemName) {
                                                                        case 'Box':
                                                                              available = detail.box.quantity;
                                                                              required = Math.ceil(detail.quantity / detail.id.in_a_box);
                                                                              isConditionMet = required <= available;
                                                                              break;
                                                                        case 'Cartoon':
                                                                              available = detail.cartoon?.cartoonType?.quantity || 0;
                                                                              required = Math.floor(
                                                                                    detail.quantity / detail.cartoon?.cartoonType?.in_a_cartoon || 1,
                                                                              );
                                                                              isConditionMet = required <= available;
                                                                              break;
                                                                        case 'Sticker':
                                                                              available = detail.id.sticker.quantity;
                                                                              required = detail.id.sticker_number * detail.quantity;
                                                                              isConditionMet = required <= available;
                                                                              break;
                                                                        case 'Plastic Bag':
                                                                              available = detail.id.plastic_bag.quantity;
                                                                              required = detail.id.plastic_bag_number * detail.quantity;
                                                                              isConditionMet = required <= available;
                                                                              break;
                                                                  }

                                                                  if (itemName === 'Cartoon' && !available) {
                                                                        return;
                                                                  }

                                                                  const renderStatusIcon = isConditionMet => {
                                                                        const color = isConditionMet ? '#8dc559' : '#bc3437';
                                                                        return <Icon name="circle" size={16} color={color} />;
                                                                  };

                                                                  return (
                                                                        <DataTable.Row key={i} style={styles.tableRow}>
                                                                              <DataTable.Cell style={styles.componentColumn}>
                                                                                    <Text style={styles.cellText}>{itemName}</Text>
                                                                              </DataTable.Cell>
                                                                              <DataTable.Cell numeric style={styles.numericColumn}>
                                                                                    <Text style={styles.cellText}>{available}</Text>
                                                                              </DataTable.Cell>
                                                                              <DataTable.Cell numeric style={styles.numericColumn}>
                                                                                    <Text style={styles.cellText}>{required}</Text>
                                                                              </DataTable.Cell>
                                                                              <DataTable.Cell style={styles.statusColumn}>
                                                                                    {renderStatusIcon(isConditionMet)}
                                                                              </DataTable.Cell>
                                                                        </DataTable.Row>
                                                                  );
                                                            })}
                                                      </DataTable>
                                                </View>
                                          </ScrollView>
                                          {detail.note && (
                                                <View style={styles.noteContainer}>
                                                      <Text style={styles.noteText}>{detail.note}</Text>
                                                </View>
                                          )}
                                    </View>
                              ))}
                        </Card.Content>

                        <Card.Actions>
                              {showActionButton && (
                                    <Button
                                          onPress={() => pressStart(cardData._id)}
                                          disabled={
                                                cardData?.details
                                                      ?.flatMap(detail => detail?.components)
                                                      ?.every(component => component?.status === 'completed') ?? false
                                          }
                                          style={styles.button}
                                          textColor={'#3e4a57'}
                                          buttonColor={'#e1bc9f'}>
                                          {actionButtonTitle ?? 'Start'}
                                    </Button>
                              )}
                        </Card.Actions>
                  </Card>
            </>
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
      avatar: {
            backgroundColor: '#e1bc9f',
            display: 'flex',
            alignItems: 'center',
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
      },
      infoRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            marginVertical: 8,
      },
      infoChip: {
            borderRadius: 20,
            margin: 4,
      },
      infoChipText: {
            fontSize: 12,
            color: '#333',
      },
      tableScroll: {
            width: '100%',
      },
      tableContainer: {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: '#bfbfbf',
            display: 'flex',
      },
      tableHeader: {
            backgroundColor: '#ECEFF1',
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
      noteText: {
            fontSize: 14,
            color: '#333',
      },
      cardActions: {
            borderTopColor: '#E0E0E0',
            justifyContent: 'flex-end',
      },
      actionButton: {
            marginHorizontal: 8,
      },
      button: {
            borderRadius: 8,
            marginHorizontal: 4,
            flex: 1,
      },
});
