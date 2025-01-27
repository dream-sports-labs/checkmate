import SquadsController from '@controllers/squads.controller'
import SquadsDao from '~/db/dao/squads.dao'

jest.mock('~/db/dao/squads.dao')

describe('SquadsController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllSquads', () => {
    it('should call SquadsDao.getAllSquads with the correct parameters', async () => {
      const mockParams = {projectId: 123}
      const mockResponse = [{squadId: 1, squadName: 'Squad A'}]

      ;(SquadsDao.getAllSquads as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SquadsController.getAllSquads(mockParams)

      expect(SquadsDao.getAllSquads).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getSquadIdByName', () => {
    it('should call SquadsDao.getSquadIdByName with the correct parameters', async () => {
      const mockParams = {squadName: 'Squad A', projectId: 123}
      const mockResponse = [{squadId: 1}]

      ;(SquadsDao.getSquadIdByName as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SquadsController.getSquadIdByName(mockParams)

      expect(SquadsDao.getSquadIdByName).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('addSquad', () => {
    it('should call SquadsDao.addSquad with the correct parameters', async () => {
      const mockParams = {
        squadName: 'New Squad',
        projectId: 123,
        createdBy: 456,
      }
      const mockResponse = {squadId: 1}

      ;(SquadsDao.addSquad as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SquadsController.addSquad(mockParams)

      expect(SquadsDao.addSquad).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('checkAndCreateSquad', () => {
    it('should return an existing squad if found', async () => {
      const mockParams = {
        squadName: 'Existing Squad',
        projectId: 123,
        createdBy: 456,
      }
      const mockResponse = [{squadId: 1}]

      ;(SquadsDao.getSquadIdByName as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SquadsController.checkAndCreateSquad(mockParams)

      expect(SquadsDao.getSquadIdByName).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse[0])
    })

    it('should create a new squad if not found', async () => {
      const mockParams = {
        squadName: 'New Squad',
        projectId: 123,
        createdBy: 456,
      }
      const mockResponse = {squadId: 2}

      ;(SquadsDao.getSquadIdByName as jest.Mock).mockResolvedValue([])
      ;(SquadsDao.addSquad as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SquadsController.checkAndCreateSquad(mockParams)

      expect(SquadsDao.getSquadIdByName).toHaveBeenCalledWith(mockParams)
      expect(SquadsDao.addSquad).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('addSquads', () => {
    it('should call SquadsDao.addSquads with the correct parameters', async () => {
      const mockParams = {
        squads: ['Squad A', 'Squad B'],
        projectId: 123,
        createdBy: 456,
      }
      const mockResponse = [{squadId: 1}, {squadId: 2}]

      ;(SquadsDao.addSquads as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SquadsController.addSquads(mockParams)

      expect(SquadsDao.addSquads).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })
})
