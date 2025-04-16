from deepface import DeepFace
import tempfile

def compare_faces(img1_file, img2_file):
    from deepface import DeepFace
    import tempfile

    try:
        with tempfile.NamedTemporaryFile(delete=True, suffix=".jpg") as temp1, \
             tempfile.NamedTemporaryFile(delete=True, suffix=".jpg") as temp2:
            
            temp1.write(img1_file.read())
            temp1.flush()

            temp2.write(img2_file.read())
            temp2.flush()

            print("Temp1 Path:", temp1.name)
            print("Temp2 Path:", temp2.name)

            result = DeepFace.verify(img1_path=temp1.name, img2_path=temp2.name)
            return result
    except Exception as e:
        print("🔥 DeepFace error:", str(e))
        return {"error": f"Exception while processing: {str(e)}"}
