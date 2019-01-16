import csv
import re


skip = ['Malta', 'Tahiti', 'Comoros', 'Barbados']
replace_country = {'Portuguese Guinea': 'Guinea', 'Vietnam DR': 'Vietnam', 'Bosnia-Herzegovina': 'Bosnia and Herzegovina',
           'Yemen AR': 'Yemen', 'Yemen DPR': 'Yemen', 'Congo DR': 'Republic of Congo', 'Congo': 'Republic of Congo',
           'Korea DPR': 'North Korea', 'United Arab Republic': 'Saudi Arabia', 'Korea Republic': 'South Korea',
           'German DR': 'Germany', 'French Guyana': 'Guyana', 'Belgian Congo': 'Republic of Congo',
           'Netherlands Guyana': 'Guyana', 'British Guyana': 'Guyana', 'Soviet Union': 'Russia',
           'Northern Ireland': 'Ireland', 'Yugoslavia': 'Bosnia and Herzegovina', 'Bohemia': 'Czech Republic',
           'Czechoslovakia': 'Czech Republic', 'USA': 'United States of America', 'Wales': 'United Kingdom',
           'Bahamas': 'The Bahamas', 'Serbia and Montenegro': 'Montenegro', 'England': 'United Kingdom',
           'Scotland': 'United Kingdom', 'Irish Free State': 'Ireland', 'Éire': 'Ireland',
           'Serbia': 'Republic of Serbia', }
replace_team = {'Portuguese Guinea': 'Guinea', 'Vietnam DR': 'Vietnam', 'Bosnia-Herzegovina': 'Bosnia and Herzegovina',
           'Yemen AR': 'Yemen', 'Yemen DPR': 'Yemen', 'Congo DR': 'Republic of Congo', 'Congo': 'Republic of Congo',
           'Korea DPR': 'North Korea', 'United Arab Republic': 'Saudi Arabia', 'Korea Republic': 'South Korea',
           'German DR': 'Germany', 'French Guyana': 'Guyana', 'Belgian Congo': 'Republic of Congo',
           'Netherlands Guyana': 'Guyana', 'British Guyana': 'Guyana', 'Soviet Union': 'Russia',
           'Northern Ireland': 'Ireland', 'Yugoslavia': 'Bosnia and Herzegovina', 'Bohemia': 'Czech Republic',
           'Czechoslovakia': 'Czech Republic', 'USA': 'United States of America',
           'Bahamas': 'The Bahamas', 'Serbia and Montenegro': 'Montenegro', 'England': 'United Kingdom',
            'Irish Free State': 'Ireland', 'Éire': 'Ireland',
           'Serbia': 'Republic of Serbia', }



def get_match_played_by_year(path='only-country-normalized-football-results.csv'):
    games_by_year={}
    count =0
    with open(path) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            if (count == 0):
                count=1
                continue
            date = row[0].split("-")[0]
            home_team = row[1]
            away_team = row[2]
            home_score = row[3]
            away_score = row[4]
            tournament = row[5]
            city = row[6]
            country = row[7]
            neutral = row[8]
            if (date not in games_by_year):
                games_by_year[date]={country:1}
            else:
                if country not in games_by_year[date]:
                    games_by_year[date][country]=1
                else:
                    games_by_year[date][country] += 1
    '''
    with open('normalized-football-results.csv', mode='w') as nfd:
        teams_writer = csv.writer(nfd, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        teams_writer.writerow(
            ['date', 'home_team', 'away_team', 'home_score', 'away_score', 'tournament', 'city', 'country', 'neutral'])
    '''
    #print(games_by_year['2011'])

    for year in games_by_year:
        print(year)
        file_name = "played_by_year/played_by_year_"+year+".csv"
        with open(file_name, mode='w') as fd:
            teams_writer = csv.writer(fd, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            teams_writer.writerow(['country', 'games'])
            for team in games_by_year[year]:
                teams_writer.writerow([team,games_by_year[year][team]])


def get_teams2(path_db):
    with open(path_db) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        with open('teams.csv', mode='w') as teams_file:
            all_teams = set()
            teams_writer = csv.writer(teams_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            line_count = 0
            for row in csv_reader:
                if line_count == 0:

                    teams_writer.writerow(["name", "games"])
                    line_count += 1
                else:
                    team_name1 = row[1]
                    team_name2 = row[2]
                    if team_name1 not in all_teams:
                        teams_writer.writerow([team_name1])

                    if team_name2 not in all_teams:
                        teams_writer.writerow([team_name2])

                    all_teams.add(team_name1)
                    all_teams.add(team_name2)
                    line_count += 1
            print(f'Processed {line_count} lines.')

def normalize_data_country(path1='map_country_id.txt', path2='football-results.csv'):

    all_teams = []
    with open(path1, "r") as fd:
        for line in fd:
            all_teams.append(line.strip())
    unkown = []
    map_team=all_teams

    tot_games = 0
    with open(path2) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        with open('only-country-normalized-football-results.csv', mode='w') as nfd:
            teams_writer = csv.writer(nfd, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            teams_writer.writerow(
                ['date', 'home_team', 'away_team', 'home_score', 'away_score', 'tournament', 'city','country', 'neutral'])

            for row in csv_reader:
                date = row[0]
                home_team = row[1]
                away_team = row[2]
                home_score = row[3]
                away_score = row[4]
                tournament = row[5]
                city = row[6]
                country = row[7]
                neutral = row[8]
                if (home_team in skip or away_team in skip or country in skip):
                    #continue
                    pass

                if (country) not in all_teams and country not in unkown and country not in skip and country not in replace_country.keys():
                    print(country)
                    unkown.append(country)

                if (home_team in replace_country):
                    home_team = replace_country[home_team]
                if (away_team in replace_country):
                    away_team = replace_country[away_team]
                if (country in replace_country):
                    country = replace_country[country]

                cond1 = country not in all_teams and country not in replace_country
                cond2 = False#home_team not in all_teams and home_team not in replace_country
                cond3 = False#away_team not in all_teams and away_team not in replace_country

                if (cond1 or cond2 or cond3):
                    continue

                teams_writer.writerow(
                    [date, home_team, away_team, home_score, away_score, tournament, city, country, neutral])
                tot_games += 1

    print(len(unkown))
    print(tot_games)

def normalize_data_team(path1='map_country_id.txt', path2='football-results.csv'):

    all_teams = []
    with open(path1, "r") as fd:
        for line in fd:
            all_teams.append(line.strip())
    unkown = []

    tot_games = 0
    with open(path2) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        with open('only-team-normalized-football-results.csv', mode='w') as nfd:
            teams_writer = csv.writer(nfd, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            teams_writer.writerow(
                ['date', 'home_team', 'away_team', 'home_score', 'away_score', 'tournament', 'city','country', 'neutral'])

            for row in csv_reader:
                date = row[0]
                home_team = row[1]
                away_team = row[2]
                home_score = row[3]
                away_score = row[4]
                tournament = row[5]
                city = row[6]
                country = row[7]
                neutral = row[8]
                if (home_team in skip or away_team in skip or country in skip):
                    #continue
                    pass

                if (home_team in replace_team):
                    home_team = replace_team[home_team]
                if (away_team in replace_team):
                    away_team = replace_team[away_team]


                cond1 = home_team not in all_teams and home_team not in replace_team
                cond2 = away_team not in all_teams and away_team not in replace_team
                cond3 = True#away_team not in all_teams and away_team not in replace

                if (cond1 and cond2 and cond3):
                    continue

                teams_writer.writerow(
                    [date, home_team, away_team, home_score, away_score, tournament, city, country, neutral])
                tot_games += 1

    print(tot_games)

def get_games_by_year(path='only-team-normalized-football-results.csv'):
    all_teams = []
    with open('map_country_id.txt', "r") as fd:
        for line in fd:
            all_teams.append(line.strip())


    win = 0
    lost = 0
    draw = 0
    games_by_year = {}
    count = 0
    with open(path) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            if (count == 0):
                count = 1
                continue
            date = row[0].split("-")[0]
            home_team = row[1]
            away_team = row[2]
            home_score = int(row[3])
            away_score = int(row[4])
            tournament = row[5]
            city = row[6]
            country = row[7]
            neutral = row[8]
            if (home_score > away_score):
                win = 1
                lost = 0
                draw = 0
            else:
                if (home_score == away_score):
                    draw = 1
                    win = 0
                    lost = 0
                else:
                    win = 0
                    lost = 1
                    draw = 0
            if (date not in games_by_year):
                                                #gol-fatti/subiti/vittorie/sconfitte/pareggi
                games_by_year[date]={home_team:[home_score,away_score,win,lost,draw]}
                if (draw==0):
                    if (win==1):
                        win=0
                        lost=1
                    else:
                        win=1
                        lost=0
                games_by_year[date]={away_team: [away_score,home_score,win,lost,draw]}

            else:
                if home_team not in games_by_year[date]:
                    games_by_year[date][home_team]=[home_score,away_score,win,lost,draw]
                else:
                    old = games_by_year[date][home_team]
                    games_by_year[date][home_team] = [old[0] + home_score, old[1] + away_score, old[2] + win,
                                                      old[3] + lost, old[4] + draw]

                if (draw==0):
                    if (win==1):
                        win=0
                        lost=1
                    else:
                        win=1
                        lost=0
                if away_team not in games_by_year[date]:
                    games_by_year[date][away_team]=[away_score,home_score,win,lost,draw]
                else:
                    old = games_by_year[date][away_team]
                    games_by_year[date][away_team] = [old[0] + away_score, old[1] + home_score, old[2] + win,
                                                      old[3] + lost, old[4] + draw]



    for year in games_by_year:
        #print(year)

        file_name = "games_by_year/games_by_year_" + year + ".csv"
        with open(file_name, mode='w') as fd:
            teams_writer = csv.writer(fd, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            teams_writer.writerow(['team','team-id','gol-done','gol-received','win','lost','draw'])
            for team in games_by_year[year]:
                if (team not in all_teams):
                    continue
                teams_writer.writerow([team,all_teams.index(team), games_by_year[year][team][0],games_by_year[year][team][1],games_by_year[year][team][2],games_by_year[year][team][3],games_by_year[year][team][4]])

def normalize_both_team_games(path1='map_country_id.txt', path2='football-results.csv'):

    all_teams = []
    with open(path1, "r") as fd:
        for line in fd:
            all_teams.append(line.strip())
    unkown = []
    map_team=all_teams

    tot_games = 0
    with open(path2) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        with open('both-team-normalized-football-results.csv', mode='w') as nfd:
            teams_writer = csv.writer(nfd, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            teams_writer.writerow(
                ['date', 'home_team', 'away_team', 'home_score', 'away_score', 'tournament', 'city','country', 'neutral'])

            for row in csv_reader:
                date = row[0]
                home_team = row[1]
                away_team = row[2]
                home_score = row[3]
                away_score = row[4]
                tournament = row[5]
                city = row[6]
                country = row[7]
                neutral = row[8]

                if (home_team in replace_team):
                    home_team = replace_team[home_team]
                if (away_team in replace_team):
                    away_team = replace_team[away_team]

                cond1 = home_team not in all_teams
                cond2 = away_team not in all_teams #home_team not in all_teams and home_team not in replace_country
                cond3 = False#away_team not in all_teams and away_team not in replace_country

                if (cond1 or cond2 or home_team==away_team):
                    continue

                teams_writer.writerow(
                    [date, home_team, away_team, home_score, away_score, tournament, city, country, neutral])
                tot_games += 1

    print(len(unkown))
    print(tot_games)

def get_matrix_by_year(path='both-team-normalized-football-results.csv'):




    count = 0
    all_games_by_year={} #<year : [[sq1,sq2,ris]]>
    all_teams_by_year={}
    with open(path) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            if (count == 0):
                count = 1
                continue
            date = row[0].split("-")[0]
            sq1 = row[1]
            sq2 = row[2]

            home_score = int(row[3])
            away_score = int(row[4])
            if (home_score==away_score):
                ris='x'
            elif(home_score>away_score):
                ris='1'
            else:
                ris='2'

            if (date not in  all_games_by_year):
                all_games_by_year[date] = [[sq1,sq2,ris]]
            else:
                all_games_by_year[date].append([sq1, sq2, ris])

            if (date not in  all_teams_by_year):
                all_teams_by_year[date] = [sq1,sq2]
            else:
                if (sq1 not in all_teams_by_year[date]): all_teams_by_year[date].append(sq1)
                if (sq2 not in all_teams_by_year[date]): all_teams_by_year[date].append(sq2)

    #print(all_games_by_year)
    #print("\n\n\n\n\n")
    #print(all_teams_by_year)

    matrix_by_year={}
    for year in all_games_by_year:
        print(year)
        total_games = all_games_by_year[year]
        #print('tot games',total_games)
        total_teams = all_teams_by_year[year]
        matrix_by_year[year]=[[0 for c in range(len(total_teams))] for j in range(len(total_teams))]
        row = len(matrix_by_year[year])
        col = len(matrix_by_year[year][0])

        for i,t1 in enumerate(total_teams):
            for j,t2 in enumerate(total_teams):

                if (i == j):continue
                #print(t1)
                #number of victories of t1 vs t2 in that year
                vict=0
                for game in total_games:
                    ht=game[0]
                    at=game[1]
                    sc=game[2]
                    #print(ht,t1,at,t2)
                    if (ht == t1 and at == t2 and sc=='1'):
                        #print("ciao1")
                        matrix_by_year[year][i][j]+=1
                    elif (ht == t2 and at == t1 and sc=='2'):
                        #print(matrix_by_year[year])
                        #print("ciao2")
                        matrix_by_year[year][i][j] += 1
                        #print(matrix_by_year[year])


        file_name = "directed_match_by_year/matrix_by_year_" + year + ".txt"
        with open(file_name, mode='w') as fd:
            for tt in total_teams:
                fd.write(tt+",")
            fd.write("\n")
            for i in range(len(total_teams)):
                for j in range(len(total_teams)):
                    fd.write(str(matrix_by_year[year][i][j])+" ")
                fd.write('\n')







#normalize_data_country()
#get_match_played_by_year()
#get_match_played_by_year()
#normalize_data_team()
#get_games_by_year()
normalize_both_team_games()
get_matrix_by_year()


