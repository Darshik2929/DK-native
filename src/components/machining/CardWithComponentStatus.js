import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text, Card, Button, Chip, DataTable, Avatar} from 'react-native-paper';
import ThreeStatusSwitch from '../../components/Switch/ThreeStatusSwitch.js';
import {format} from 'date-fns';

export default function CardWithComponentStatus({cardData, showSwitch, patchOrderStatus, pressStart, actionButtonTitle, showActionButton}) {
      const allComponentsCompleted = cardData.product.every(productItem =>
            productItem.components.every(component => component.status === 'completed'),
      );

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
                              {cardData?.product?.map((product, index) => {
                                    return (
                                          <View
                                                key={index}
                                                style={{
                                                      ...styles.productContainer,
                                                      borderBottomWidth: cardData.product.length - 1 !== index ? 1 : 0,
                                                }}>
                                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                                      <Text style={styles.productTitle}>{product?.id?.name}</Text>
                                                      <Chip
                                                            style={{...styles.infoChip, backgroundColor: '#3e4a57'}}
                                                            textStyle={{...styles.infoChipText, color: 'white'}}>
                                                            {product.quantity} Qty.
                                                      </Chip>
                                                </View>

                                                <View style={styles.infoRow}>
                                                      <Chip style={{...styles.infoChip, backgroundColor: '#e8e6e6'}} textStyle={styles.infoChipText}>
                                                            Color : {product.color?.name}
                                                      </Chip>
                                                      <Chip style={{...styles.infoChip, backgroundColor: '#e8e6e6'}} textStyle={styles.infoChipText}>
                                                            Box : {product.box?.name}
                                                      </Chip>
                                                </View>

                                                <ScrollView style={{width: '100%'}}>
                                                      <View style={styles.tableContainer}>
                                                            <DataTable>
                                                                  <DataTable.Header style={styles.tableHeader}>
                                                                        <DataTable.Title style={styles.componentColumn}>
                                                                              <Text style={styles.headerText}>Part</Text>
                                                                        </DataTable.Title>
                                                                        {showSwitch && (
                                                                              <DataTable.Title style={{justifyContent: 'center'}}>
                                                                                    <Text style={styles.headerText}>Status</Text>
                                                                              </DataTable.Title>
                                                                        )}
                                                                  </DataTable.Header>

                                                                  {product.components.map((item, index) => (
                                                                        <DataTable.Row key={index} style={styles.tableRow}>
                                                                              <DataTable.Cell style={styles.componentColumn}>
                                                                                    <Text variant="labelLarge">
                                                                                          {item.id?.name} ({item.quantity * product.quantity})
                                                                                    </Text>
                                                                              </DataTable.Cell>
                                                                              {showSwitch && (
                                                                                    <DataTable.Cell
                                                                                          style={{
                                                                                                ...styles.componentColumn,
                                                                                                justifyContent: 'flex-end',
                                                                                                marginRight: -12,
                                                                                                paddingTop: 10,
                                                                                          }}>
                                                                                          <ThreeStatusSwitch
                                                                                                width="90%"
                                                                                                status={item.status}
                                                                                                onChange={status =>
                                                                                                      patchOrderStatus(
                                                                                                            status,
                                                                                                            item.id._id,
                                                                                                            product.id._id,
                                                                                                            cardData._id,
                                                                                                      )
                                                                                                }
                                                                                          />
                                                                                    </DataTable.Cell>
                                                                              )}
                                                                        </DataTable.Row>
                                                                  ))}
                                                            </DataTable>
                                                      </View>
                                                </ScrollView>

                                                {product.note && (
                                                      <View style={styles.noteContainer}>
                                                            <Text style={styles.noteText}>{product.note}</Text>
                                                      </View>
                                                )}
                                          </View>
                                    );
                              })}

                              {((showSwitch && allComponentsCompleted) || !showSwitch) && showActionButton && (
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
                        </Card.Content>
                  </Card>
            </>
      );
}

const styles = StyleSheet.create({
      container: {
            flexGrow: 1,
            backgroundColor: '#FFFFFF',
            padding: 16,
      },
      card: {
            marginVertical: 8,
            borderRadius: 12,
            elevation: 3,
            backgroundColor: '#FFF',
      },
      cardContent: {
            backgroundColor: '#ebedf0',
            shadowColor: '#000',
            shadowOffset: {
                  width: 0,
                  height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginVertical: 8,
            borderRadius: 8,
      },
      text: {
            marginVertical: 2,
      },
      button: {
            borderRadius: 8,
      },
      modal: {
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {
                  width: 0,
                  height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
      },
      input: {
            marginBottom: 16,
      },
      modalActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
      },
      modalButton: {
            flex: 1,
            marginHorizontal: 8,
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
      productTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#37474F',
            marginBottom: 8,
      },
      infoChip: {
            borderRadius: 20,
      },
      infoChipText: {
            fontSize: 12,
            color: '#333',
      },
      infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 8,
            flexWrap: 'wrap',
            gap: 6,
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
            width: '100%',
      },
      numericColumn: {
            width: '20%',
            justifyContent: 'center',
      },
      headerText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#37474F',
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
      cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 12,
      },
});
