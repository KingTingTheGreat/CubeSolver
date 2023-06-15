import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from twophase import solve as getSolution

app = Flask(__name__)
CORS(app)

def ULFRBD_to_URFDLB(cubstring:str) -> str:
    u, l, f, r, b, d = [cubstring[i:i+9] for i in range(0, 54, 9)]
    cube = u + r + f + d + l + b
    return ''.join(cube)

@app.route('/api/solve', methods=['GET'])
def solve(ULFRBD=True, URFDLB=False):
    assert ULFRBD != URFDLB, 'Only one of ULFRBD or URFDLB must be True'
    response = {}
    try:
        cubestring:str = request.args.get('cubeString')
        if ULFRBD:
            cubestring = ULFRBD_to_URFDLB(cubestring)
        solution = getSolution(cubestring)
        # cube is already solved
        if solution == '':
            solution = ' '
        print(f'Solution: {solution}')
        response['solution'] = solution
    except Exception as e:
        print(f'Exception: {e}')
        response['error'] = str(e)
    return jsonify(response)

@app.route('/api/scramble', methods=['GET'])
def scramble(length=20):
    print('Scrambling...')
    faces = ['U', 'L', 'F', 'R', 'B', 'D']
    directions = ['', "'", '2']
    forbidden = {face:face for face in faces}  # don't move the same face two turns in a row
    forbidden['U'] = 'D'
    forbidden['D'] = 'U'
    forbidden['L'] = 'R'
    forbidden['R'] = 'L'
    forbidden['F'] = 'B'
    forbidden['B'] = 'F'
    response = {}
    scramble = [random.choice(faces)+random.choice(directions)]
    for _ in range(length-1):
        face = random.choice(faces)
        while face[0] == forbidden[scramble[-1][0]]:
            face = random.choice(faces)
        scramble.append(face+random.choice(directions))
    response['scramble'] = ' '.join(scramble)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
    # app.run(host='0.0.0.0', port=5000)