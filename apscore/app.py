from apscore.datamanager import collector, writer


def run():
    data = collector.get_all_exam_results()
    writer.write_all_data_to_directory(data, 'data')
