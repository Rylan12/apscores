import csv
import json
import os
import shutil

HEADERS = ['Year', '5', '4', '3', '2', '1', 'Mean', '3+', '2-', 'Total # Students', 'Major Revision']


def write_data_to_csv_file(data: dict, filename: str) -> None:
    """Write exam data to a file in csv format

    :param data: a dictionary containing data for an exam
    :param filename: the filename to write the data to
    :rtype: None
    """
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f, lineterminator='\n')

        writer.writerow(HEADERS)

        for year in data.keys():
            writer.writerow(data[year])


def write_data_to_json_file(data: dict, filename: str) -> None:
    """Write exam data to a file in json format

    :param data: a dictionary containing data for an exam
    :param filename: the filename to write the data to
    :rtype: None
    """
    with open(filename, 'w') as f:
        json.dump(data, f)


def write_all_data_to_csv_directory(data: dict, directory: str) -> None:
    """Write data for all exams to csv files in a given directory

    :param data: a dictionary containing data for all exams
    :param directory: the directory to write the files to
    :rtype: None
    """
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

    for exam in data.keys():
        filepath = os.path.join(directory, exam.name + '.csv')
        write_data_to_csv_file(data[exam], filepath)


def write_all_data_to_json_directory(data: dict, directory: str) -> None:
    """Write data for all exams to json files in a given directory

    :param data: a dictionary containing data for all exams
    :param directory: the directory to write the files to
    :rtype: None
    """
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

    for exam in data.keys():
        filepath = os.path.join(directory, exam.name + '.json')
        write_data_to_json_file(data[exam], filepath)


def write_exam_list(data: dict, filename: str) -> None:
    """Write a list of exam names to a json file

    :param data: a dictionary containing data for all exams
    :param filename: the file to write the list of exams to
    :rtype: None
    """
    exams = [e.name for e in data.keys()]
    with open(filename, 'w') as f:
        json.dump(exams, f)


def write_all_data_to_directory(data: dict, directory: str) -> None:
    """Write data for all exams in both csv and json formats to subdirectories in a given directory

    :param data: a dictionary containing data for all exams
    :param directory: the directory to write the files to
    :rtype: None
    """
    write_exam_list(data, os.path.join(directory, 'exams.json'))
    write_all_data_to_csv_directory(data, os.path.join(directory, 'csv'))
    write_all_data_to_json_directory(data, os.path.join(directory, 'json'))
