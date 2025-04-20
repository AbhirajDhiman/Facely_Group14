from flask import Blueprint, request, jsonify

from .services.faceVerify import compare_faces

main = Blueprint('main', __name__)

@main.route('/verify', methods=['POST'])
def verify_route():
    try:
        img1 = request.files['img1']
        img2 = request.files['img2']
        result = compare_faces(img1, img2)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
