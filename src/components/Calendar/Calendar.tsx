import React, { useMemo, ReactElement} from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getDate } from '@utils/helpers';
import styles from './Calendar.module.scss'
import { Dropdown, Paper } from '@app/compLibrary';
import DropDownSelect from '../DropDownSelect/DropDownSelect';
import { useAppDispatch } from '@app/hooks/redux_hooks';
import DashboardActions from '@app/redux/actions/DashboardAction'
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import DropDownSelect from '@app/components/DropDownSelect'

interface Icons {
  rightArrow: ReactElement, 
  leftArrow: ReactElement
}

type CalendarProps = {
    data: any,
    statusList: any
    fetchStatuses:  { isLoading: boolean, isError: boolean }, 
    onChange: (startDate: any, endDate: any) => void,
    // setStatusId: Function,
    iconGroup: Icons

}

const CalendarComponent = (props: CalendarProps) => {
    const {data, statusList,fetchStatuses, iconGroup, onChange}= props
    const {t, i18n} = useTranslation()
    const dispatch = useAppDispatch()
    const language = i18n.language as string
    
    const months: Array<string> = [1,2,3,4,5,6,7,8,9,10,11,12].map(item => t(`months.${item}`))
    const weekdays: Array<string> = ['mon','tue','wed','thu','fri','sut','sun'].map(item => t(`days.${item}`))

    moment.updateLocale("tk", {
      week: {
        dow: language === 'en' ? 1 : 0,
      },
      weekdays: weekdays,
      months : months
    });


    const localizer = momentLocalizer(moment)

    const { formats } = useMemo(
      () => ({
        formats: {
          weekdayFormat: (date: any, culture: any, localizer: any) =>
            localizer.format(date, 'dddd', culture),
        },
      }),
      []
    )

    const messages = {
      previous: iconGroup.leftArrow as any,
      next: iconGroup.rightArrow as any,
      today: t('todayBtn')
    }

    
    const events = data && data?.map((item: any, index: number) => {
      return {
        id: index,
        title: Number(item.ord_count),
        start: item.dt,
        end: item.dt
      }
    })


    return (
      <Paper rounded fullWidth>
          <div className={styles.headTxt}>
            <h4>{t('calendarTitle')}</h4>
            <div className={styles.dropDown}>
              <DropDownSelect
                dropDownContentStyle={{right: '0'}}
                data={statusList}
                fetchStatuses={fetchStatuses}
                onChange={(data) => dispatch(DashboardActions.setStatusId(data.value as string))}
                title={t('selectDashboardStatus')}
                titleSingleLine
              />
            </div>
          </div>
          <Calendar
              culture={i18n.language}
              localizer={localizer}
              events={events}
              className={styles.calendar}
              messages={messages}
              formats={formats}
              views={["month"]}
              startAccessor='start'
              endAccessor='end'
              onNavigate={(date) => {
                const {startDate, endDate} = getDate(date)
                onChange(startDate, endDate)
              }}
      />
      </Paper>
    )
}

export default CalendarComponent;