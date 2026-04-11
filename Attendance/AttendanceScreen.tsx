import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useApi } from '../Api/ApiContextProvider';
import { AttendableType } from '../Api/Models/Attendance';
import { Permission } from '../Api/Models/Permission';
import { getUserInfo, UserInfo } from '../Api/UserApi';
import InsufficientPermissions from '../Auth/InsufficientPermissions';
import LoadingScreen from '../Components/LoadingScreen';
import MenuHeader from '../Components/MenuHeader';
import MenuLink from '../Components/MenuLink';
import { useTheme } from '../Themes/ThemeContextProvider';
import AttendableSelect from './AttendableSelect';

const requiredPermissions: Permission[] = [Permission.CREATE_ATTENDANCE, Permission.READ_USERS];

/*
Architecture:
Attendance Screen > AttendableSelect > TapABuzzCard > BuzzCardPrompt
*/
function AttendanceScreen() {
  const api = useApi();
  const [user, setUser] = useState<UserInfo | null | undefined>(undefined);
  const [missingPermissions, setMissingPermissions] = useState<Permission[] | undefined>(undefined);
  const { currentTheme } = useTheme();

  async function onRefreshUser(forceRefresh: boolean = false) {
    if (!user || forceRefresh) {
      setUser(await getUserInfo(api));
    }
  }

  function getPermissions() {
    let missingPermissions: Permission[] = [];
    if (user && user.allPermissions) {
      const permissions = user.allPermissions;
      missingPermissions = requiredPermissions.filter((item) => !permissions.includes(item));
    }
    setMissingPermissions(missingPermissions);
  }

  useEffect(() => {
    onRefreshUser(true);
    getPermissions();
  }, []);

  function AttendableSelectionScreen() {
    const [attendanceType, setAttendanceType] = useState<AttendableType>(AttendableType.NONE);

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
        {attendanceType === AttendableType.NONE ? (
          <>
            <MenuHeader title={'What do you want to take attendance for?'}></MenuHeader>
            <MenuLink
              title="Team"
              icon="group"
              onClick={() => {
                setAttendanceType(AttendableType.TEAM);
              }}
            ></MenuLink>
            <MenuLink
              title="Event"
              icon="event"
              onClick={() => {
                setAttendanceType(AttendableType.EVENT);
              }}
            ></MenuLink>
          </>
        ) : (
          <AttendableSelect
            attendanceType={attendanceType}
            setAttendanceType={setAttendanceType}
          ></AttendableSelect>
        )}
      </SafeAreaView>
    );
  }

  return (
    <>
      {user && missingPermissions ? (
        missingPermissions.length != 0 ? (
          <InsufficientPermissions
            featureName="Attendance"
            requiredPermissions={requiredPermissions}
            missingPermissions={missingPermissions}
            onRetry={() => {}}
          ></InsufficientPermissions>
        ) : (
          <AttendableSelectionScreen></AttendableSelectionScreen>
        )
      ) : (
        <LoadingScreen></LoadingScreen>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

export default AttendanceScreen;
