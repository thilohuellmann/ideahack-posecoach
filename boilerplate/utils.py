from catboost import CatBoostClassifier
model = CatBoostClassifier()
model.load_model('model.cbm')

def transform_data(input):
    drop = ['leftAnkle', 'rightAnkle']
    transformed = [input['pose']['score']]
    for keypoint in input['pose']['keypoints']:
        if keypoint['part'] in drop:
            continue
        transformed.append(keypoint['score'])

    for keypoint in input['pose']['keypoints']:
        if keypoint['part'] in drop:
            continue
        transformed.append(keypoint['position']['x']*1.8)
        transformed.append(keypoint['position']['y']*1.8)

    return transformed

def predict(data):
    bad = model.predict_proba(data)[0]
    good = model.predict_proba(data)[1]
    return bad, good