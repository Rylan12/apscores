from apscore.datamanager import collector, writer


def run(update=False):
    if update:
        data = collector.get_all_exam_results()
        writer.write_all_data_to_directory(data, 'data')
    print('Analysis')
