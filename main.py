import re
import pandas as pd
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup

url = 'https://fbref.com/it/comp/11/calendario/Risultati-e-partite-di-Serie-A'
table = pd.read_html(url)
options = webdriver.ChromeOptions()
options.binary_location = r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
chrome_driver_binary = r"G:\Progetto_Lore\chromedriver.exe"
driver = webdriver.Chrome(chrome_driver_binary, chrome_options=options)
driver.maximize_window()
driver.implicitly_wait(5)
window_before = driver.window_handles[0]

driver.get(url)
WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME,'stats_table')))
fixtures = pd.read_html(url)[0]
fixtures.dropna(subset=['Casa'],inplace=True)
n_matches = len(fixtures.index)
played = fixtures.dropna(subset=['Punteggio'])
n_played = len(played.index)
fixtures.reset_index(drop=True, inplace=True)
nrow = len(fixtures.index)
tmain = driver.find_element(By.TAG_NAME,'table')
rows = tmain.find_elements(By.XPATH,'//a[contains(text(), "Report partita")]')
template_sum = {}
index = 0
print(fixtures.loc[110])
for i in range(n_matches):
    index=index+1
    print(i)
    infos = fixtures.loc[i]
    print(infos)
    base_stats_new = {
        'ID Partita' : (int(index),int(index)),
        'Giornata' : (int(infos['Sett.']),int(infos['Sett.'])),
        'Squadra' : (str(infos['Casa']),str(infos['Ospiti']))
    }
    if i<n_played:
        punteggio = str(infos['Punteggio']).split('–')
        goals_h = punteggio[0]
        goals_a = punteggio[1]
        tmain = driver.find_element(By.TAG_NAME,'table')
        rows = tmain.find_elements(By.XPATH,'//a[contains(text(), "Report partita")]')
        tables = pd.read_html(rows[i].get_attribute('href'))
        driver.get(rows[i].get_attribute('href'))
        formazione_h=tables[0]
        formazione_a=tables[1]
        base_stats= tables[2]
        stats_players_h1= tables[3]
        stats_players_h2= tables[4]
        stats_players_h3= tables[5]
        stats_players_h4= tables[6]
        stats_players_h5= tables[7]
        stats_players_h6= tables[8]
        stats_gk_h= tables[9]
        stats_players_a1= tables[10]
        stats_players_a2= tables[11]
        stats_players_a3= tables[12]
        stats_players_a4= tables[13]
        stats_players_a5= tables[14]
        stats_players_a6= tables[15]
        stats_gk_a= tables[16]
        shots= tables[17]
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID,'team_stats_extra')))
        base_stats_new['Goals']=(int(goals_h),int(goals_a))
        base_stats_new['Goals Subiti']=(int(goals_a),int(goals_h))
        base_stats_new['Possesso palla']=(int(str(base_stats.loc[0][0]).replace('%','')),int(str(base_stats.loc[0][1]).replace('%','')))
    
        for i in range(len(base_stats.index)-1):
            title = str(base_stats.loc[i][0])
            h_value = re.split('(\d+)',str(base_stats.loc[i+1][0]))
            a_value = re.split('(\d+)',str(base_stats.loc[i+1][1]))
            h_value = h_value[1::2]
            a_value = a_value[1::2]
            for i in range(2):
                for i in range(0,len(h_value),3):
                    spl_title = title.split(' ')
                    base_stats_new[spl_title[0]+' Totali'] = (int(h_value[i+1]),int(a_value[i+2] if len(a_value)==3 else 0))
                    base_stats_new[title] = (int(h_value[i]),int(a_value[i+1]))
                    if 'Tiri' in title:
                        h_offTarget=int(h_value[i+1])-int(h_value[i])
                        a_offTarget=int(a_value[i+2])-int(a_value[i+1])
                        base_stats_new[spl_title[0]+' fuori Porta'] = (int(h_offTarget),int(a_offTarget))
                        base_stats_new['Percentuale '+title] = (int(h_value[i+2] if len(h_value)==3 else 0),int(a_value[i]))

        cards = driver.find_element(By.XPATH,'//*[@id="team_stats"]/table/tbody/tr[11]')
        y_cards=[]
        r_cards=[]
        for i,team in enumerate(cards.find_elements(By.TAG_NAME,'td')):
            y_cards.append([])
            r_cards.append([])
            for card in team.find_elements(By.TAG_NAME,'span'):
                if card.get_attribute('class') == 'yellow_card':
                    y_cards[i].append(card)
                elif card.get_attribute('class') == 'red_card':
                    r_cards[i].append(card)
        base_stats_new['Cartellini Gialli']= (int(len(y_cards[0])),int(len(y_cards[1])))
        base_stats_new['Cartellini Rossi']= (int(len(r_cards[0]) if len(r_cards[0])!=0 else 0),int(len(r_cards[1]) if len(r_cards[1])!=0 else 0))
        base_stats_new['Cartellini Totali']=(int(len(y_cards[0]))+int(0 if len(r_cards[0])==0 else len(r_cards[0])),int(len(y_cards[1]))+int(0 if len(r_cards[1])==0 else len(r_cards[1])))


        for i in range(3):
            extra_stats = driver.find_element(By.CSS_SELECTOR,'#team_stats_extra > div:nth-child('+str(i+1)+')')
            elements_extra_stats = extra_stats.find_elements(By.XPATH,'.//*')
            for i in range(3,len(elements_extra_stats),3):
                h_value = elements_extra_stats[i].text
                title = elements_extra_stats[i+1].text
                a_value = elements_extra_stats[i+2].text
                base_stats_new[title] = (int(h_value),int(a_value))
        driver.back()
    if len(template_sum) == 0:
            template_sum=base_stats_new
    else:
        for key in base_stats_new:
            if template_sum[key]:
                template_sum[key] = template_sum[key]+base_stats_new[key]
            else:
                pass
df = pd.DataFrame.from_dict(template_sum, orient='index')
df = df.transpose()
df_home=[]
df_away=[]
for i in range(1,int(len(df.index)/2)+1):
    current = df[df['ID Partita'] == i]
    current.reset_index(drop=True, inplace=True)
    home = current[current.index == 0]
    away = current[current.index == 1]
    away.reset_index(drop=True, inplace=True)
    df_home.append(home.loc[0])
    df_away.append(away.iloc[0])

home_df = pd.DataFrame(df_home)
away_df = pd.DataFrame(df_away)
df_h = home_df.groupby('Squadra',as_index=False).mean(numeric_only=True).drop(['ID Partita','Giornata'], axis=1)
df_a = away_df.groupby('Squadra',as_index=False).mean(numeric_only=True).drop(['ID Partita','Giornata'], axis=1)
df_h.to_excel('df_home.xlsx', index=False)
df_a.to_excel('df_away.xlsx', index=False)
df.to_excel('df_sum_try.xlsx', index=False)
driver.quit()