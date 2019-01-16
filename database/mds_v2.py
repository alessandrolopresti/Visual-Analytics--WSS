import csv
import numpy as np
import time
import scipy.sparse
from sklearn.decomposition import TruncatedSVD
from  matplotlib import pyplot as plt
import time
from sklearn.cluster import KMeans
from sklearn.cluster import AgglomerativeClustering
from spherecluster import SphericalKMeans
from spherecluster import VonMisesFisherMixture
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import Normalizer
from sklearn import manifold

from sklearn import cluster, datasets
from sklearn.preprocessing import StandardScaler
from itertools import cycle, islice


def get_matrix(path='both-team-normalized-football-results.csv'):
    '''

    :param path:
    :return: victory/loss ration
    '''
    total_teams=[]
    count = 0
    all_games=[] #< [[sq1,sq2,ris]]>
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
            if (home_score==away_score):
                ris='x'
            elif(home_score>away_score):
                ris='1'
            else:
                ris='2'

            all_games.append([sq1, sq2, ris])
    print(all_games)



    #print('tot games',total_games)

    matrix=[[(1,1) for c in range(len(total_teams))] for j in range(len(total_teams))]
    row = len(matrix)
    col = len(matrix[0])
    for match in all_games:
        sq1_idx = total_teams.index(match[0])
        sq2_idx = total_teams.index(match[1])
        if (sq1_idx == sq2_idx):
            print('error')
            print(match)
            print(sq1_idx)
            print(sq2_idx)

        ris = match[2]
        if (ris == '1'):
            matrix[sq1_idx][sq2_idx]=(matrix[sq1_idx][sq2_idx][0]+1,matrix[sq1_idx][sq2_idx][1])
            matrix[sq2_idx][sq1_idx] = (matrix[sq2_idx][sq1_idx][0] , matrix[sq2_idx][sq1_idx][1]+1)
        elif(ris=='2'):
            matrix[sq1_idx][sq2_idx] = (matrix[sq1_idx][sq2_idx][0], matrix[sq1_idx][sq2_idx][1]+1)
            matrix[sq2_idx][sq1_idx] = (matrix[sq2_idx][sq1_idx][0]+1, matrix[sq2_idx][sq1_idx][1] )
    print(matrix)
    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            #vittorie/sconfitte * log2(parititegiocate)
            if (i==j):
                matrix[i][j]=0
            else:
                matrix[i][j]=(matrix[i][j][0]/matrix[i][j][1])*(matrix[i][j][0]+matrix[i][j][1])#*np.log2(matrix[i][j][0]+matrix[i][j][1])
    return matrix,total_teams









def explained_variance_and_inertia():
    s=time.time()
    mat, team = get_matrix()
    print(team)
    data=mat
    print("loaded in ",time.time()-s)
    svd = TruncatedSVD(n_components=15)
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

#explained_variance_and_inertia()

def cluster(n_cluster=5,n_svd=15):
    mat, team = get_matrix()
    data = mat
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

def mds_test(dissM,teams):

    mds = manifold.MDS(n_components=2, max_iter=30, eps=1e-9,dissimilarity="precomputed",random_state=2)
    pos = mds.fit(dissM).embedding_
    stress=mds.fit(dissM).stress_

    plt.scatter(pos[:, 0], pos[:, 1], marker = 'o')
    for label, x, y in zip(teams, pos[:, 0], pos[:, 1]):
        label = unicode(label, "utf-8")
        plt.annotate(
            label,
            xy = (x, y), xytext = (-20, 20),
            textcoords = 'offset points', ha = 'right', va = 'bottom',
            bbox = dict(boxstyle = 'round,pad=0.3', fc = 'yellow', alpha = 0.5),
            arrowprops = dict(arrowstyle = '->', connectionstyle = 'arc3,rad=0'))

    plt.show()

#d,t = get_matrix()
#mds_test(d,t)



def get_matrix_per_year(path='both-team-normalized-football-results.csv'):
    '''

    :param path:
    :return: victory/loss ration
    '''
    total_teams=[]
    count = 0
    date=0
    tour=''
    all_games=[] #< [[sq1,sq2,ris]]>
    with open(path) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            if (count == 0):
                count = 1
                continue
            date = row[0].split('-')[0]
            tour=row[5]
            sq1 = row[1]
            sq2 = row[2]
            if (sq1 not in total_teams):
                total_teams.append(sq1)
            if (sq2 not in total_teams):
                total_teams.append(sq2)


            home_score = int(row[3])
            away_score = int(row[4])
            if (home_score==away_score):
                ris='x'
            elif(home_score>away_score):
                ris='1'
            else:
                ris='2'

            all_games.append([sq1, sq2, ris,date,tour])
    print(all_games)


    num_mondiali = 35
    first_date = 2018 - (4 * num_mondiali) + 4





    #print('tot games',total_games)

    #total_years=20
    matrix=[[(0,0) for c in range(num_mondiali)] for j in range(len(total_teams))]
    row = len(total_teams)
    col = num_mondiali

    n_mondial = 0
    year_prec = first_date


    for match in all_games:



        sq1_idx = total_teams.index(match[0])
        sq2_idx = total_teams.index(match[1])
        date = int(match[3])
        torneo=match[4]
        if (date <= first_date):continue
        print(torneo)
        if (torneo!='FIFA World Cup'):continue
        print('ciao')


        if (date != year_prec):
            n_mondial += 1
            year_prec = date


        if (sq1_idx == sq2_idx):
            print('error')
            print(match)
            print(sq1_idx)
            print(sq2_idx)

        ris = match[2]

        #y_factor=np.log2(year+1)
        if (ris == '1'):

            matrix[sq1_idx][n_mondial]=(  (matrix[sq1_idx][n_mondial][0]+3)   ,matrix[sq1_idx][n_mondial][1])


        elif(ris=='2'):
            matrix[sq2_idx][n_mondial] = (matrix[sq2_idx][n_mondial][0] + 3, matrix[sq2_idx][n_mondial][1])
        if (ris=='x'):
            matrix[sq2_idx][n_mondial] = (matrix[sq2_idx][n_mondial][0] + 1, matrix[sq2_idx][n_mondial][1])
            matrix[sq1_idx][n_mondial] = (matrix[sq1_idx][n_mondial][0] + 1, matrix[sq1_idx][n_mondial][1])

        matrix[sq1_idx][n_mondial] = (matrix[sq1_idx][n_mondial][0] , matrix[sq1_idx][n_mondial][1]+1)

        matrix[sq2_idx][n_mondial] = (matrix[sq2_idx][n_mondial][0],matrix[sq2_idx][n_mondial][1]+1)


    for i in range(row):
        for j in range(col):
                #matrix[i][j]=(matrix[i][j][0]/matrix[i][j][1])
                matrix[i][j] = matrix[i][j][0]



    print(matrix)
    #normalizer = Normalizer(copy=False)
    #matrix=normalizer.fit_transform(matrix)
    return matrix,total_teams

def mds_test_euclidean(dissM,teams):
    brz_idx=teams.index('Brazil')
    fr_idx = teams.index('France')
    ger_idx = teams.index('Germany')
    pol_idx = teams.index('Poland')
    print(dissM[brz_idx])
    print(dissM[fr_idx])
    print(dissM[ger_idx])
    print(dissM[pol_idx])

    mds = manifold.MDS(n_components=2, max_iter=30000, random_state=2)
    pos = mds.fit(dissM).embedding_
    stress=mds.fit(dissM).stress_

    svd = TruncatedSVD(n_components=15)
    #normalizer = Normalizer(copy=False)
    #lsa = make_pipeline(svd, normalizer)
    data_red = svd.fit_transform(dissM)

    Y_evr=[svd.explained_variance_ratio_[:i+1].sum() for i in range(len(svd.explained_variance_ratio_))]
    X_evr=[i+1 for i in range(len(svd.explained_variance_ratio_))]
    plt.plot(X_evr,Y_evr,'.')
    plt.xlabel('rank')
    plt.ylabel('explained variance ratio')
    plt.savefig('explained-variance.png')
    plt.close()

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


    kmeans = KMeans(n_clusters=5).fit(data_red)
    #kmeans = SphericalKMeans(n_clusters=2, max_iter=5000, n_init = 100).fit(data_red)
    #KMeans(n_clusters=2,max_iter=1000,n_init=100).fit(pos)

    #kmeans = VonMisesFisherMixture(n_clusters=2, posterior_type='soft').fit(data_red)

    #kmeans = AgglomerativeClustering(n_clusters=2, linkage='single').fit(data_red)
#    print(kmeans.cluster_centers_)
    print(kmeans.labels_)
    i=0
    for n in teams:
        print(n+' : ',kmeans.labels_[i])
        i+=1

    palette = ['green', 'red', 'blue','brown','yellow']

    plt.plot( pos[:, 0],pos[:, 1], 'ro', markersize=1)
    for i,el in enumerate(teams):
        if (el in ['Brazil','Italy','France','Germany','Sweden'] or True):
            #if (kmeans.labels_[i] == 0):
            plt.annotate(el, xy=(pos[i][0], pos[i][1]), color=palette[kmeans.labels_[i]],size=5)



    plt.show()
    plt.close()

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
        for i,el in enumerate(teams):
            team=el
            print(teams)
            x_v= pos[i,0]
            y_v= pos[i,1]
            cluster=kmeans.labels_[i]
            rank=dic_fifa_rank[team]
            kmeans_writer.writerow([team,x_v,y_v,cluster,str(rank)])




palette = ['green', 'red', 'blue','brown','yellow']
d,t = get_matrix_per_year()
svd = TruncatedSVD(n_components=15)
data_red = svd.fit_transform(d)
plt.plot(data_red[:, 0], data_red[:, 1], 'ro', markersize=1)
kmeans = KMeans(n_clusters=5).fit(d)
for i, el in enumerate(t):
    if (el in ['Brazil', 'Italy', 'France', 'Germany', 'Sweden'] or True):
        # if (kmeans.labels_[i] == 0):
        plt.annotate(el, xy=(data_red[i][0], data_red[i][1]), color=palette[kmeans.labels_[i]], size=5)
plt.show()
#mds_test_euclidean(d,t)

