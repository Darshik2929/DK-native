import {format} from 'date-fns';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text, Card, Avatar, Button, Chip, DataTable} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CardComponent({cardData, cardActionButton, department}) {
      const renderStatusIcon = isConditionMet => {
            const color = isConditionMet ? '#8dc559' : '#bc3437';
            return <Icon name="circle" size={16} color={color} />;
      };

      const checkProductConditions = () => {
            return cardData.product.every(detail => {
                  const boxCondition = detail.box && detail.quantity / detail.id.in_a_box <= detail.box.quantity;

                  const cartoonCondition =
                        detail.cartoon.cartoonOption === 'noCartoon' ||
                        (detail.cartoon.cartoonType &&
                              detail.quantity / detail.cartoon.cartoonType.in_a_cartoon <= detail.cartoon.cartoonType.quantity);

                  const stickerCondition = detail.id.sticker && detail.id.sticker_number * detail.quantity <= detail.id.sticker.quantity;

                  const plasticBagCondition =
                        detail.id.plastic_bag && detail.id.plastic_bag_number * detail.quantity <= detail.id.plastic_bag.quantity;

                  return boxCondition && cartoonCondition && stickerCondition && plasticBagCondition;
            });
      };

      const areConditionsMet = checkProductConditions();

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
                        {cardData.product.map((detail, index) => (
                              <View
                                    key={index}
                                    style={{...styles.productContainer, borderBottomWidth: cardData.product.length - 1 !== index ? 1 : 0}}>
                                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
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
                                                Sticker: {detail.id.sticker.name}
                                          </Chip>
                                          <Chip style={{...styles.infoChip, backgroundColor: '#fef9c3'}} textStyle={styles.infoChipText}>
                                                Plastic Bag: {detail.id.plastic_bag.name}
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

                                                      {department !== 'packaging'
                                                            ? detail.components.map((item, compIndex) => (
                                                                    <DataTable.Row key={compIndex} style={styles.tableRow}>
                                                                          <DataTable.Cell style={styles.componentColumn}>
                                                                                <Text style={styles.cellText}>{item.id.name}</Text>
                                                                          </DataTable.Cell>
                                                                          <DataTable.Cell numeric style={styles.numericColumn}>
                                                                                <Text style={styles.cellText}>{item.id.quantity}</Text>
                                                                          </DataTable.Cell>
                                                                          <DataTable.Cell numeric style={styles.numericColumn}>
                                                                                <Text style={styles.cellText}>{item.quantity * detail.quantity}</Text>
                                                                          </DataTable.Cell>
                                                                          <DataTable.Cell style={styles.statusColumn}>
                                                                                {renderStatusIcon(
                                                                                      item.quantity * detail.quantity <= item.id.quantity,
                                                                                )}
                                                                          </DataTable.Cell>
                                                                    </DataTable.Row>
                                                              ))
                                                            : ['Box', 'Cartoon', 'Sticker', 'Plastic Bag'].map((itemName, i) => {
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
                                                                                      detail.quantity / detail.cartoon?.cartoonType?.in_a_cartoon ||
                                                                                            1,
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

                  <Card.Actions
                        style={{
                              ...styles.cardActions,

                              paddingVertical: 16,

                              paddingLeft: cardActionButton.length ? 12 : 0,
                              paddingRight: cardActionButton.length ? 20 : 0,

                              borderTopWidth: cardActionButton.length ? 1 : 0,
                        }}>
                        {cardActionButton.map((el, index) => {
                              if (!areConditionsMet && (index === 1 || index === 2)) {
                                    return null;
                              }

                              return (
                                    <Button
                                          style={[styles.button]}
                                          buttonColor={index === 1 && '#e1bc9f'}
                                          textColor={index == 1 && '#3e4a57'}
                                          key={index}
                                          onPress={() => el.handle(cardData)}>
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
            marginTop: 10,
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
            // marginHorizontal: 4,
            flex: 1,
      },
});
