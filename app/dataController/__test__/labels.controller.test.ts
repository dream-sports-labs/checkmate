import LabelsController from '@controllers/labels.controller'
import LabelsDao from '~/db/dao/labels.dao'

jest.mock('~/db/dao/labels.dao')

describe('LabelsController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllLabels', () => {
    it('should call LabelsDao.getAllLabels with the correct parameters', async () => {
      const mockParams = {projectId: 123, minData: true}
      const mockResponse = [{labelId: 1, labelName: 'Label A'}]

      ;(LabelsDao.getAllLabels as jest.Mock).mockResolvedValue(mockResponse)

      const result = await LabelsController.getAllLabels(mockParams)

      expect(LabelsDao.getAllLabels).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getSystemLabels', () => {
    it('should call LabelsDao.getSystemLabels with the correct projectId', async () => {
      const projectId = 123
      const mockResponse = [{labelId: 1, labelName: 'System Label'}]

      ;(LabelsDao.getSystemLabels as jest.Mock).mockResolvedValue(mockResponse)

      const result = await LabelsController.getSystemLabels(projectId)

      expect(LabelsDao.getSystemLabels).toHaveBeenCalledWith(projectId)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getCustomLabels', () => {
    it('should call LabelsDao.getCustomLabels with the correct projectId', async () => {
      const projectId = 123
      const mockResponse = [{labelId: 1, labelName: 'Custom Label'}]

      ;(LabelsDao.getCustomLabels as jest.Mock).mockResolvedValue(mockResponse)

      const result = await LabelsController.getCustomLabels(projectId)

      expect(LabelsDao.getCustomLabels).toHaveBeenCalledWith(projectId)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('addLabelTestMap', () => {
    it('should call LabelsDao.addLabelTestMap with the correct parameters', async () => {
      const mockParams = {
        testIds: [1, 2, 3],
        labelId: 10,
        projectId: 123,
        createdBy: 456,
      }
      const mockResponse = {affectedRows: 3}

      ;(LabelsDao.addLabelTestMap as jest.Mock).mockResolvedValue(mockResponse)

      const result = await LabelsController.addLabelTestMap(mockParams)

      expect(LabelsDao.addLabelTestMap).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('addLabels', () => {
    it('should call LabelsDao.addLabels with the correct parameters', async () => {
      const mockParams = {
        labels: ['Label A', 'Label B'],
        projectId: 123,
        createdBy: 456,
      }
      const mockResponse = [{labelId: 1, labelName: 'Label A'}]

      ;(LabelsDao.addLabels as jest.Mock).mockResolvedValue(mockResponse)

      const result = await LabelsController.addLabels(mockParams)

      expect(LabelsDao.addLabels).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })
})
