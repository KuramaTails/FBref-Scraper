from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def load_matches(elems,template_sum,driver,window_before):
    driver.execute_script("arguments[0].click();", elems)
    window_after = driver.window_handles[1]
    driver.switch_to.window(window_after)
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
        'H_Goals': '',
        'A_Goals': '',
        'H_Ball Possession' : '0',
        'A_Ball Possession' : '0',
        'H_Goal Attempts' : '0',
        'A_Goal Attempts' : '0',
        'H_Shots on Goal' : '0',
        'A_Shots on Goal' : '0',
        'H_Shots off Goal' : '0',
        'A_Shots off Goal' : '0',
        'H_Free Kicks' : '0',
        'A_Free Kicks' : '0',
        'H_Blocked Shots' : '0',
        'A_Blocked Shots' : '0',
        'H_Corner Kicks' : '0',
        'A_Corner Kicks' : '0',
        'H_Offsides' : '0',
        'A_Offsides' : '0',
        'H_Throw-in' : '0',
        'A_Throw-in' : '0',
        'H_Goalkeeper Saves' : '0',
        'A_Goalkeeper Saves' : '0',
        'H_Fouls' : '0',
        'A_Fouls' : '0',
        'H_Yellow Cards' : '0',
        'A_Yellow Cards' : '0',
        'H_Red Cards' : '0',
        'A_Red Cards' : '0',
        'H_Total Passes' : '0',
        'A_Total Passes' : '0',
        'H_Completed Passes' : '0',
        'A_Completed Passes' : '0',
        'H_Tackles' : '0',
        'A_Tackles' : '0',
        'H_Attacks' : '0',
        'A_Attacks' : '0',
        'H_Dangerous Attacks' : '0',
        'H_Dangerous Attacks' : '0'
    })
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME,'mi__item__name')))
    tournament_header =  driver.find_element(By.CLASS_NAME,'tournamentHeader__country').text
    stat['Round'] = int(tournament_header.split(' ')[len(tournament_header.split(' '))-1])
    start_Time = driver.find_element(By.CLASS_NAME,'duelParticipant__startTime').text.split(" ")
    stat['Date'] = start_Time[0]
    stat['Time'] = start_Time[1]
    stat['H_Team'] = driver.find_element(By.CLASS_NAME,'duelParticipant__home').text
    stat['A_Team'] = driver.find_element(By.CLASS_NAME,'duelParticipant__away').text
    score = driver.find_element(By.CLASS_NAME,'detailScore__wrapper').text.split("\n")
    stat['H_Goals'] = int(score[0])
    stat['A_Goals'] = int(score[2])
    stat['Status'] = driver.find_element(By.CLASS_NAME,'detailScore__status').text
    for row in driver.find_elements(By.CLASS_NAME,'mi__item'):
        row_stats = row.find_elements(By.CSS_SELECTOR,'*')
        column_value = row_stats[0].text
        a = column_value[0]
        b = column_value[1:len(column_value)-1].lower()
        column_value = a+b
        stat[column_value] = row_stats[4].text
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH,'//a[@href="'+"#/match-summary/match-statistics"+'"]')))
    driver.execute_script("arguments[0].click();", driver.find_element(By.XPATH,'//a[@href="'+"#/match-summary/match-statistics"+'"]'))
    stats = driver.find_elements(By.CLASS_NAME,'stat__category')
    for row in stats:
        row_stats = row.find_elements(By.CSS_SELECTOR,'*')
        if "%" in row_stats[0].text:
            stat['H_'+row_stats[1].text] = int(row_stats[0].text.replace("%",''))
            stat['A_'+row_stats[1].text] = int(row_stats[2].text.replace("%",''))
        else:
            stat['H_'+row_stats[1].text] = int(row_stats[0].text)
            stat['A_'+row_stats[1].text] = int(row_stats[2].text)
    template_sum.append(stat)
    driver.close()
    driver.switch_to.window(window_before)