import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';

type InsufficientPermissionsProps = { 
    featureName: string,
    onRetry: () => void,
    missingPermissions: string[],
    requiredPermissions: string[],
};

function InsufficientPermissions({ featureName, onRetry, 
    missingPermissions, requiredPermissions }: InsufficientPermissionsProps) {
    const [detailsVisible, setDetailsVisible] = useState(false);

    type PermissionDetailsListProps = { 
        permissions: string[],
        hasPermission: boolean
    };
    const PermissionDetailsList = ({permissions, hasPermission} : PermissionDetailsListProps) => {
        return permissions.map((permission, index) => (
            <View key={index} style={[ styles.permissionItem, { borderTopWidth: index === 0 ? 1 : 0 }]}>
                {hasPermission? 
                    <MaterialIcons name={"check-circle-outline"} size={30} color="#36B92B" style={{ margin: 20 }} />
                    :
                    <MaterialIcons name={"error-outline"} size={30} color="#b00020" style={{ margin: 20 }} />
                }
                <Text style={{ fontSize: 20 }}>{permission}</Text>
            </View>
        ));
    }

    const PermissionDetailsDialog = () => {
        return (
            <Modal
            animationType="fade"
            transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 25, marginVertical: 20 }}>Required Permissions</Text>
                        <PermissionDetailsList permissions={missingPermissions} hasPermission={false}/>
                        <PermissionDetailsList permissions={requiredPermissions} hasPermission={true}/>
                        <View style={{ alignItems:'flex-end', marginVertical: 20 }}>
                            <Button
                                onPress={() => setDetailsVisible(false)}
                                title="Close"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10 }}>
            {
                detailsVisible && 
                <PermissionDetailsDialog></PermissionDetailsDialog>
            }
            <MaterialIcons name={"error-outline"} size={100} color="#b00020" style={{ padding: 10 }} />
            <Text style={{ fontSize: 30, textAlign: "center", marginBottom: 20 }}>
                {featureName} permissions required
            </Text>
            <View style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
                <View style={{marginHorizontal: 5}}>
                    <Button onPress={() => {}} title="Go to #it-helpdesk" />
                </View>
                <View style={{marginHorizontal: 5}}>
                    <Button onPress={onRetry} color="#EEB211" title="Retry" />
                </View>
            </View>
            <View style={{marginTop: 10}}>
                <Button onPress={() => setDetailsVisible(true)} title="View details" />
            </View>
        </View> 
    );
}

const styles = StyleSheet.create({
    modalView: {
        margin: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width:"75%"
    },
    permissionItem: { 
        justifyContent: 'flex-start', 
        alignItems: "center", 
        flexDirection:"row", 
        borderBlockColor:"gray", 
        borderBottomWidth: 1
    }
});

export default InsufficientPermissions;