import csv
import numpy as np
import time
import scipy.sparse
from sklearn.decomposition import TruncatedSVD
from  matplotlib import pyplot as plt
import time
from sklearn.cluster import KMeans
from wordcloud import WordCloud
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import Normalizer



def get_matrix(path='both-team-normalized-football-results.csv'):
    '''

    :param path:
    :return: victory/loss ration
    '''
    total_teams=[]
    count = 0
    all_games=[] #< [[sq1,sq2,ris]]>
    c1 = 0
    c2 = 0
    with open(path) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            if (count == 0):
                count = 1
                continue
            sq1 = row[1]
            sq2 = row[2]
            if (sq1 not in total_teams):
                total_teams.append(sq1)
            if (sq2 not in total_teams):
                total_teams.append(sq2)


            home_score = int(row[3])
            away_score = int(row[4])
            tourn = row[5]
            type=-1

            if (tourn == 'FIFA World Cup qualification'):
                type=1
                c1+=1

            elif(tourn == 'FIFA World Cup'):
                type=2
                c2+=1

            else:
                continue
            if (home_score==away_score):
                ris='x'
            elif(home_score>away_score):
                ris='1'
            else:
                ris='2'

            all_games.append([sq1, sq2, ris,type])
    print(c1,c2)

    print(all_games)



    #print('tot games',total_games)

    matrix=[[0 for c in range(4)] for j in range(len(total_teams))]
    row = len(matrix)
    col = len(matrix[0])
    print(row,col)

    WIN_Q=0
    LOSS_Q=1
    WIN_C=2
    LOSS_C=3

    for match in all_games:
        sq1_idx = total_teams.index(match[0])
        sq2_idx = total_teams.index(match[1])
        if (sq1_idx == sq2_idx):
            print('error')
            print(match)
            print(sq1_idx)
            print(sq2_idx)

        ris = match[2]
        type=match[3]
        if (ris == '1'):
            if (type == 1):
                matrix[sq1_idx][WIN_Q]+=1
                matrix[sq2_idx][LOSS_Q] += 1
            elif(type==2):
                matrix[sq1_idx][WIN_C] += 1
                matrix[sq2_idx][LOSS_C] += 1

        elif(ris=='2'):
            if (type == 1):
                matrix[sq2_idx][WIN_Q] += 1
                matrix[sq1_idx][LOSS_Q] += 1
            elif (type == 2):
                matrix[sq2_idx][WIN_C] += 1
                matrix[sq1_idx][LOSS_C] +=1

    return matrix,total_teams


def explained_variance_and_inertia():
    s=time.time()
    mat, team = get_matrix()
    print(mat,team)
    data=mat
    print("loaded in ",time.time()-s)
    svd = TruncatedSVD(n_components=2)
    s=time.time()

    normalizer = Normalizer(copy=False)
    lsa = make_pipeline(svd, normalizer)
    data_red=lsa.fit_transform(data)

    print("fit in ", time.time() - s)
    Y_evr=[svd.explained_variance_ratio_[:i+1].sum() for i in range(len(svd.explained_variance_ratio_))]
    X_evr=[i+1 for i in range(len(svd.explained_variance_ratio_))]
    plt.plot(X_evr,Y_evr,'.')
    plt.xlabel('rank')
    plt.ylabel('explained variance ratio')
    plt.savefig('explained-variance.png')

    Y_inertia=[]
    X_inertia=[i for i in range(2,10,1)]
    for n_cl in range(2,10,1):
        print("test with ",n_cl," clusters")
        kmeans = KMeans(n_clusters=n_cl).fit(data_red)
        print(kmeans.inertia_/ n_cl)
        Y_inertia.append(kmeans.inertia_ / n_cl)
    plt.close()
    plt.plot(X_inertia,Y_inertia,'.')
    plt.xlabel('number of clusters')
    plt.ylabel('average inertia per cluster')
    plt.savefig('average-inertia.png')
    plt.close()



def cluster(n_cluster=4,n_svd=2):
    mat, team = get_matrix()
    print('team: ',team)
    data = mat
    print(data)
    svd = TruncatedSVD(n_components=n_svd)
    normalizer = Normalizer(copy=False)
    lsa = make_pipeline(svd, normalizer)
    data_red = lsa.fit_transform(data)
    kmeans = KMeans(n_clusters=n_cluster,max_iter=1000,n_init=100).fit(data_red)
    print(kmeans.cluster_centers_)
    print(kmeans.labels_)
    i=0
    for n in team:
        print(n+' : ',kmeans.labels_[i])
        i+=1
    print(data_red.shape)
    X_val = [el[0 ]for el in data_red]
    Y_val = [el[1] for el in data_red]
    plt.rcParams["figure.figsize"] = (8, 8)

    plt.plot(X_val,Y_val,'ro',markersize=1)

    colors=['yellow','green','black','blue','brown']
    for i,el in enumerate(team):
        plt.annotate(el, xy=(X_val[i], Y_val[i]), color=colors[kmeans.labels_[i]],size=5)
    #plt.show()

    dic_fifa_rank={}
    with open('fifa_rank.csv', mode='r') as fr:
        fifa_reader = csv.reader(fr, delimiter=',')
        count=0
        for row in fifa_reader:
            if(count==0):
                count=1
                continue
            team_name=row[0]
            print(row[1])
            rank=int(row[1])

            if team_name not in dic_fifa_rank:
                dic_fifa_rank[team_name]=rank
            else:
                dic_fifa_rank[team_name] = min(rank,dic_fifa_rank[team_name])


    with open('kmeans.csv', mode='w') as nfd:
        kmeans_writer = csv.writer(nfd, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        kmeans_writer.writerow(['team','x','y','cluster','rank'])
        for i,el in enumerate(team):
            team=el
            print(team)
            x_v=X_val[i]
            y_v=Y_val[i]
            cluster=kmeans.labels_[i]
            rank=dic_fifa_rank[team]
            kmeans_writer.writerow([team,x_v,y_v,cluster,str(rank)])



#get_matrix()
explained_variance_and_inertia()
cluster()