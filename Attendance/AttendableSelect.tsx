import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useApi } from '../Api/ApiContextProvider';
import { EventInfo, getEventInfo, getTeamInfo, TeamInfo } from '../Api/MeetingsApi';
import { AttendableType } from '../Api/Models/Attendance';
import LoadingScreen from '../Components/LoadingScreen';
import MenuHeader from '../Components/MenuHeader';
import MenuLink from '../Components/MenuLink';
import TapABuzzCard from './TapABuzzCard';

type AttendanceProps = {
  attendanceType: AttendableType;
  setAttendanceType: (state: AttendableType) => void;
};

function AttendableSelect({ attendanceType, setAttendanceType }: AttendanceProps) {
  const api = useApi();
  const [attendables, setAttendables] = useState<TeamInfo[] | EventInfo[] | null | undefined>(
    undefined,
  );
  const [attendable, setAttendable] = useState<TeamInfo | EventInfo | undefined>(undefined);

  async function onRefreshAttendables(forceRefresh: boolean = false) {
    if (forceRefresh) {
      if (attendanceType === AttendableType.TEAM) {
        setAttendables(await getTeamInfo(api));
      } else {
        setAttendables(await getEventInfo(api));
      }
    }
  }

  useEffect(() => {
    onRefreshAttendables(true);
  }, []);

  function AttendableList() {
    if (attendables) {
      const attendableList = [];
      for (const attendable of attendables) {
        attendableList.push(
          <MenuLink
            key={attendable.id}
            icon="people"
            title={attendable.name}
            onClick={() => {
              setAttendable(attendable);
            }}
          ></MenuLink>,
        );
      }
      return attendableList;
    } else {
      return <LoadingScreen></LoadingScreen>;
    }
  }

  return (
    <>
      {attendable ? (
        <TapABuzzCard
          attendanceType={attendanceType}
          setAttendanceType={setAttendanceType}
          attendable={attendable}
          setAttendable={setAttendable}
        ></TapABuzzCard>
      ) : (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <Button
              title="Change team or event"
              onPress={() => {
                setAttendanceType(AttendableType.NONE);
              }}
            />
            <MenuHeader title={'What do you want to take attendance for?'}></MenuHeader>
            <AttendableList></AttendableList>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
});

export default AttendableSelect;
