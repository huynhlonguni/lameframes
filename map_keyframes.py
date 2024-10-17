import os
import csv
import json

def shortenNumber(string):
	num_float = float(string)

	return int(num_float) if num_float.is_integer() else num_float

def csv_to_json(folder_path, output_file, off_by_one, skip_details):
	master_data = {}

	for filename in os.listdir(folder_path):
		if filename.endswith('.csv'):
			file_path = os.path.join(folder_path, filename)
			csv_key = os.path.splitext(filename)[0]

			with open(file_path, mode='r') as csvfile:
				reader = csv.DictReader(csvfile)
				frames = []
				fps = None
				
				# Loop through rows and extract necessary data
				for row in reader:
					if fps is None:  # Extract FPS from the first row
						fps = shortenNumber(row['fps'])

					frame = [shortenNumber(row['pts_time']), shortenNumber(row['frame_idx']) - int(off_by_one)]
					frames.append(frame)

				# Store data in master_data using the csv_key
				master_data[csv_key] = {
					"fps": fps,
					"frames": {"length": len(frames)} if skip_details else frames
				}

	# Write the master JSON file
	with open(output_file, mode='w') as jsonfile:
		json.dump(master_data, jsonfile)

# folder_path = 'map-keyframes-v1'
# output_file = 'src/map-keyframes-v1.json'
# csv_to_json(folder_path, output_file, off_by_one=False) # Keyframe tự tạo đánh từ 1, keyframe BTC đánh từ 0
# print(f'Master JSON file created: {output_file}')

# folder_path = 'map-keyframes-v2'
# output_file = 'src/map-keyframes.json'
# csv_to_json(folder_path, output_file, off_by_one=True) # Keyframe tự tạo đánh từ 1, keyframe BTC đánh từ 0
# print(f'Master JSON file created: {output_file}')

folder_path = 'map-keyframes-v3'
output_file = 'src/utils/map-keyframes.json'
csv_to_json(folder_path, output_file, off_by_one=False, skip_details=True) # Keyframe tự tạo đánh từ 1, keyframe BTC đánh từ 0
print(f'Master JSON file created: {output_file}')
