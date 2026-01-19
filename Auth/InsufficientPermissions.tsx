import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../Themes/Colors';

type InsufficientPermissionsProps = {
  featureName: string;
  onRetry: () => void;
  missingPermissions: string[];
  requiredPermissions: string[];
};

function InsufficientPermissions({
  featureName,
  onRetry,
  missingPermissions,
  requiredPermissions,
}: InsufficientPermissionsProps) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const satisfiedPermissions = requiredPermissions.filter(
    (item) => !missingPermissions.includes(item),
  );

  type PermissionDetailsListProps = {
    permissions: string[];
    hasPermission: boolean;
  };
  const PermissionDetailsList = ({ permissions, hasPermission }: PermissionDetailsListProps) => {
    return permissions.map((permission, index) => (
      <View key={index} style={index === 0 ? styles.permissionItemFirst : styles.permissionItem}>
        {hasPermission ? (
          <MaterialIcons
            name={'check-circle-outline'}
            size={30}
            color={Colors.success}
            style={styles.icon}
          />
        ) : (
          <MaterialIcons
            name={'error-outline'}
            size={30}
            color={Colors.danger}
            style={styles.icon}
          />
        )}
        <Text style={styles.permissionItemText}>{permission}</Text>
      </View>
    ));
  };

  const PermissionDetailsDialog = () => {
    return (
      <Modal animationType="fade" transparent={true}>
        <View style={styles.viewContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Required Permissions</Text>
            <PermissionDetailsList permissions={missingPermissions} hasPermission={false} />
            <PermissionDetailsList permissions={satisfiedPermissions} hasPermission={true} />
            <View style={styles.modalButton}>
              <Button onPress={() => setDetailsVisible(false)} title="Close" />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.viewContainer}>
      {detailsVisible && <PermissionDetailsDialog></PermissionDetailsDialog>}
      <MaterialIcons name={'error-outline'} size={100} color={Colors.danger} style={styles.icon} />
      <Text style={styles.mainText}>{featureName} permissions required</Text>
      <View style={styles.buttonTopRow}>
        <View style={styles.button}>
          <Button onPress={() => {}} title="Go to #it-helpdesk" />
        </View>
        <View style={styles.button}>
          <Button onPress={onRetry} color={Colors.Gold} title="Retry" />
        </View>
      </View>
      <View style={styles.buttonBottomRow}>
        <Button onPress={() => setDetailsVisible(true)} title="View details" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 5,
  },
  buttonBottomRow: {
    marginTop: 10,
  },
  buttonTopRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  icon: {
    margin: 10,
  },
  mainText: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    alignItems: 'flex-end',
    marginVertical: 20,
  },
  modalText: {
    fontSize: 20,
    marginVertical: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    margin: 20,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '75%',
  },
  permissionItem: {
    alignItems: 'center',
    borderBlockColor: 'gray',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  permissionItemFirst: {
    alignItems: 'center',
    borderBlockColor: 'gray',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  permissionItemText: {
    fontSize: 15,
  },
  viewContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
});

export default InsufficientPermissions;
