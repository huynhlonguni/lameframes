import os
import json

def load_json_files(folder_path):
	master_data = {}

	for filename in os.listdir(folder_path):
		if filename.endswith('.json'):
			file_path = os.path.join(folder_path, filename)

			with open(file_path, 'r', encoding='utf-8') as json_file:
				data = json.load(json_file)

				video_name = os.path.splitext(filename)[0]

				if 'watch_url' in data:
					master_data[video_name] = {'watch_url': data['watch_url'], "id": data['watch_url'].replace("https://youtube.com/watch?v=", "")}

	return master_data

def create_master_json(folder_path, output_file):
	master_data = load_json_files(folder_path)

	with open(output_file, 'w', encoding='utf-8') as master_json_file:
		json.dump(master_data, master_json_file, ensure_ascii=False, indent=4)

folder_path = 'media-info'
output_file = 'src/media-info.json'
create_master_json(folder_path, output_file)

print(f'Master JSON file created: {output_file}')
