import csv
import json
import logging
import os
import shutil

# Set up logger
log = logging.getLogger(__name__)

HEADERS = ['Year', '5', '4', '3', '2', '1', 'Mean', '3+', '2-', 'Total # Students', 'Major Revision']


def write_data_to_csv_file(data: dict, filename: str) -> None:
    """Write exam data to a file in csv format

    :param data: a dictionary containing data for an exam
    :param filename: the filename to write the data to
    :rtype: None
    """
    log.debug(f'Writing csv data to: {filename}')

    with open(filename, 'w', newline='') as f:
        log.debug(f'Opened {filename}')
        writer = csv.writer(f, lineterminator='\n')

        writer.writerow(HEADERS)

        for year in data.keys():
            writer.writerow(data[year])

    log.debug(f'Closed {filename}')


def write_data_to_json_file(data: dict, filename: str) -> None:
    """Write exam data to a file in json format

    :param data: a dictionary containing data for an exam
    :param filename: the filename to write the data to
    :rtype: None
    """
    log.debug(f'Writing json data to: {filename}')

    with open(filename, 'w') as f:
        log.debug(f'Opened {filename}')
        json.dump(data, f)

    log.debug(f'Closed {filename}')


def write_all_data_to_csv_directory(data: dict, directory: str) -> None:
    """Write data for all exams to csv files in a given directory

    :param data: a dictionary containing data for all exams
    :param directory: the directory to write the files to
    :rtype: None
    """
    log.debug(f'Writing csv data to: {directory}/')
    if os.path.exists(directory):
        log.debug(f'Removing existing directory: {directory}/')
        shutil.rmtree(directory)
    log.debug(f'Creating directory: {directory}/')
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
    log.debug(f'Writing json data to: {directory}/')
    if os.path.exists(directory):
        log.debug(f'Removing existing directory: {directory}/')
        shutil.rmtree(directory)
    log.debug(f'Creating directory: {directory}/')
    os.makedirs(directory)

    for exam in data.keys():
        filepath = os.path.join(directory, exam.name + '.json')
        write_data_to_json_file(data[exam], filepath)


def write_all_data_to_directory(data: dict, directory: str) -> None:
    """Write data for all exams in both csv and json formats to subdirectories in a given directory

    :param data: a dictionary containing data for all exams
    :param directory: the directory to write the files to
    :rtype: None
    """
    log.info(f'Writing data')
    write_all_data_to_csv_directory(data, os.path.join(directory, 'csv'))
    write_all_data_to_json_directory(data, os.path.join(directory, 'json'))
