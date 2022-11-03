from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def reload_unplayed(elems,nr_row,driver,df_excel,window_before):
    driver.execute_script("arguments[0].click();", elems)
    window_after = driver.window_handles[1]
    driver.switch_to.window(window_after)
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME,'mi__item__name')))
    stat= ({
            'Round' : '',
            'Date': '',
            'Time': '',
            'H_Team': '',
            'A_Team': '',
            'Status': '',
            'Referee': '',
            'Venue': '',
            'Attendance': '',
        })
    
    tournament_header =  driver.find_element(By.CLASS_NAME,'tournamentHeader__country').text
    stat['Round'] = int(tournament_header.split(' ')[len(tournament_header.split(' '))-1])
    start_Time = driver.find_element(By.CLASS_NAME,'duelParticipant__startTime').text.split(" ")
    stat['Date'] = start_Time[0]
    stat['Time'] = start_Time[1]
    stat['H_Team'] = driver.find_element(By.CLASS_NAME,'duelParticipant__home').text
    stat['A_Team'] = driver.find_element(By.CLASS_NAME,'duelParticipant__away').text
    
    for row in driver.find_elements(By.CLASS_NAME,'mi__item'):
        row_stats = row.find_elements(By.CSS_SELECTOR,'*')
        column_value = row_stats[0].text
        a = column_value[0]
        b = column_value[1:len(column_value)-1].lower()
        column_value = a+b
        stat[column_value] = row_stats[4].text
    try:
        df_excel.iloc[nr_row] = stat
    except:
        df_excel.loc[nr_row] = stat
    driver.close()
    driver.switch_to.window(window_before) 