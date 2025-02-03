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

  describe('addMulitpleSquads', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should return success for valid squads', async () => {
      const mockSquads = ['Alpha', 'Bravo', 'Charlie']
      const mockProjectId = 1
      const mockCreatedBy = 123

      jest
        .spyOn(SquadsController, 'checkAndCreateSquad')
        .mockResolvedValueOnce({squadId: 1, squadName: 'Alpha', projectId: 1})
        .mockResolvedValueOnce({squadId: 2, squadName: 'Bravo', projectId: 1})
        .mockResolvedValueOnce({squadId: 3, squadName: 'Charlie', projectId: 1})

      const result = await SquadsController.addMulitpleSquads({
        squads: mockSquads,
        projectId: mockProjectId,
        createdBy: mockCreatedBy,
      })

      expect(result?.success).toHaveLength(3)
      expect(result?.failed).toHaveLength(0)
    })

    it('should return failed for squads with missing names', async () => {
      const mockSquads = ['Alpha', '', 'Charlie'] // One squad is missing a name
      const mockProjectId = 1
      const mockCreatedBy = 123

      jest
        .spyOn(SquadsController, 'checkAndCreateSquad')
        .mockResolvedValueOnce({squadId: 1, squadName: 'Alpha', projectId: 1})
        .mockRejectedValueOnce(new Error('Squad name is missing')) // Failing squad
        .mockResolvedValueOnce({squadId: 3, squadName: 'Charlie', projectId: 1})

      const result = await SquadsController.addMulitpleSquads({
        squads: mockSquads,
        projectId: mockProjectId,
        createdBy: mockCreatedBy,
      })

      expect(result.success).toHaveLength(2) // Alpha & Charlie succeeded
      expect(result.failed).toHaveLength(1)
      expect(result.failed[0].message).toBe('Squad name is missing')
    })

    it('should correctly handle a mix of successful and failed squads', async () => {
      const mockSquads = ['Alpha', 'Beta', 'InvalidSquad', 'Charlie']
      const mockProjectId = 1
      const mockCreatedBy = 123

      jest
        .spyOn(SquadsController, 'checkAndCreateSquad')
        .mockResolvedValueOnce({squadId: 1, squadName: 'Alpha', projectId: 1})
        .mockRejectedValueOnce(new Error('Database error')) // Beta fails
        .mockRejectedValueOnce(new Error('Squad name is invalid')) // InvalidSquad fails
        .mockResolvedValueOnce({squadId: 3, squadName: 'Charlie', projectId: 1})

      const result = await SquadsController.addMulitpleSquads({
        squads: mockSquads,
        projectId: mockProjectId,
        createdBy: mockCreatedBy,
      })

      expect(result.success).toHaveLength(2) // Alpha & Charlie succeeded
      expect(result.failed).toHaveLength(2) // Beta & InvalidSquad failed
      expect(result.failed[0].message).toBe('Database error')
      expect(result.failed[1].message).toBe('Squad name is invalid')
    })
  })
})
