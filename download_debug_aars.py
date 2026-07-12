import urllib.request
import os

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    try:
        print(f'Downloading {url} to {local_path}')
        urllib.request.urlretrieve(url, local_path)
        print('Success!')
    except Exception as e:
        print(f'Failed: {e}')

downloads = [
    ('https://repo.maven.apache.org/maven2/com/facebook/react/react-android/0.86.0/react-android-0.86.0-debug.aar', 'android/localMaven/com/facebook/react/react-android/0.86.0/react-android-0.86.0-debug.aar'),
    ('https://repo.maven.apache.org/maven2/com/facebook/react/react-android/0.86.0/react-android-0.86.0-debug.pom', 'android/localMaven/com/facebook/react/react-android/0.86.0/react-android-0.86.0-debug.pom'),
    ('https://repo.maven.apache.org/maven2/com/facebook/hermes/hermes-android/250829098.0.14/hermes-android-250829098.0.14-debug.aar', 'android/localMaven/com/facebook/hermes/hermes-android/250829098.0.14/hermes-android-250829098.0.14-debug.aar'),
    ('https://repo.maven.apache.org/maven2/com/facebook/hermes/hermes-android/250829098.0.14/hermes-android-250829098.0.14-debug.pom', 'android/localMaven/com/facebook/hermes/hermes-android/250829098.0.14/hermes-android-250829098.0.14-debug.pom')
]

for url, path in downloads:
    download_file(url, path)
