package com.amdocs.digital.ms.party.organizationvalidator.business.services.implementation;

import static org.mockito.Mockito.when;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.amdocs.digital.ms.party.organizationvalidator.business.errorhandling.exceptions.EntityNotFoundException;
import com.amdocs.digital.ms.party.organizationvalidator.business.internationalization.interfaces.IMessages;
import com.amdocs.digital.ms.party.organizationvalidator.business.repository.dto.interfaces.IValidateMoveOrganizationDTO;
import com.amdocs.digital.ms.party.organizationvalidator.business.repository.interfaces.IOrganizationValidationRepository;
import com.amdocs.digital.ms.party.organizationvalidator.couchbase.dto.ValidateMoveOrganizationDTO;
import com.amdocs.digital.ms.party.organizationvalidator.tests.setup.MockitoBaseTest;

public class GetValidateMoveOrganizationApplicationServiceTest extends MockitoBaseTest{
	@InjectMocks
	private GetValidateMoveOrganizationApplicationService getValidateMoveOrganizationApplicationService;
	
	@Mock
	private IOrganizationValidationRepository organizationValidationRepository;
	
	private static IValidateMoveOrganizationDTO validateMoveOrganizationDTO;
	
	
	@Mock
    private IMessages messages;

	
	@Before
	public void setUp() {
		validateMoveOrganizationDTO = new ValidateMoveOrganizationDTO();
		validateMoveOrganizationDTO.setId("validate1");
		when(organizationValidationRepository.getValidateMoveOrganization("validateMergeOrganization1")).thenReturn(validateMoveOrganizationDTO);
	}
	
	@Test
	public void getValidateMergeOrganizationTest_success(){
		IValidateMoveOrganizationDTO validateMergeOrganizationDTO= getValidateMoveOrganizationApplicationService.getValidateMoveOrganization("en-Us", null, null, null, null, null, null, "validateMergeOrganization1");
		Assert.assertNotNull(validateMergeOrganizationDTO);
	}
	
	@Test(expected=EntityNotFoundException.class)
	public void getValidateMergeOrganizationTest_failure(){
		when(organizationValidationRepository.getValidateMoveOrganization("validateMergeOrganization1")).thenReturn(null);
		IValidateMoveOrganizationDTO validateMergeOrganizationDTO= getValidateMoveOrganizationApplicationService.getValidateMoveOrganization("en-Us", null, null, null, null, null, null, "validateMergeOrganization1");
	}

}
